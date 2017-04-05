/**
 * Handles saving and retrieving documents from the store.
 *
 * TODO:
 *   - More error handling and logging
 */

import winston from 'winston';
import PostgresStore from './postgres_store';
import RandomKeyGenerator from './key_generator';
import fs from 'fs';
import path from 'path';
import config from '../config/config';
import { privacyOptions } from '../../shared/config/constants';
import { postgresTimestamp } from './_helpers';

class DocHandler {

  static contentType = {
    json:  { 'content-type': 'application/json' },
    plain: { 'content-type': 'text/plain' }
  };

  static splitDocKey = docKey => {
    const docParts = docKey.split('.', 2);
    return {
      key: docParts[0], lang: docParts[1]
    }
  };

  // Returns the proper file path if the file exists
  static getFilePath = fileName => {
    const filePath = path.join(__dirname, `../uploads/${fileName}`);
    return (fs.existsSync(filePath)) ? filePath : null;
  };

  constructor() {
    this.store = new PostgresStore();
    this.maxLength = config.maxLength;
    this.keyGenerator = new RandomKeyGenerator();
  }

  fail = (res, opts) => {
    if (opts.serverMsg) winston.warn(opts.serverMsg);
    res.writeHead(opts.resCode || 404, DocHandler.contentType.json);
    res.end(JSON.stringify({ message: opts.clientMsg }));
  };

  async handleGet(docKey, res, options = {}) {
    const { key, lang } = DocHandler.splitDocKey(docKey);
    const data = await this.store.getByKey(key);

    // Return the data object if there's text available or if it's a file paste
    // and the file still exists
    if (data && (data.text || (data.file_name && DocHandler.getFilePath(data.file_name)))) {
      winston.verbose('Retrieved document', { key });
      res.end(JSON.stringify(data));
    } else {
      winston.warn('Document not found', { key });
      res.writeHead(404, DocHandler.contentType.json);
      res.end(JSON.stringify({ message: 'Document not found.' }));
    }
  }

  async handleRawGet(docKey, res) {
    const { key, lang } = DocHandler.splitDocKey(docKey),
          data = await this.store.getByKey(key);

    if (data && data.text) {
      // Don't return raw docs that are encrypted
      if (data.privacy == privacyOptions.encrypted) fail();
      winston.verbose('Retrieved raw document', { key });
      res.writeHead(200, DocHandler.contentType.plain);
      res.end(data.text);
    }

    this.fail(res, {
      clientMsg: 'Document not found.',
      serverMsg: 'RawGet: Document not found.'
    });
  }

  handleGetFile(filename, res) {
    try {
      const filePath = path.join(__dirname, `../uploads/${filename}`);
      if (fs.existsSync(filePath)) res.sendFile(filePath);
      else throw new Error('File not found.');
    } catch(e) {
      this.fail(res, {
        clientMsg: 'File not found.',
        serverMsg: 'Problem serving file: ' + e,
      });
    }
  }

  async handleGetList(req, res) {
    const data = await this.store.getList();
    winston.verbose('Retrieving document list.');
    res.writeHead(200, DocHandler.contentType.plain);
    res.end(JSON.stringify(data));
  }

  async handlePost(req, res) {
    let data = req.body,
        file = req.files[0];

    // Generate a new key
    const key = await this.chooseKey();

    /**
     * Do some validation
     **/
    const errors = [];

    // TODO: also use /shared for validation
    // Make sure the text data isn't too big
    if (data.text.length > this.maxLength) {
      winston.warn('Document exceeds max length.', {maxLength: this.maxLength});
      errors.push('Document exceeds max length.');
    }

    // If there is no file, make sure there is text
    if (!file && !data.text) {
      winston.warn('No text data for document.');
      errors.push('No text data for document.');
    }

    // Try writing the file if it exists
    try {
      if (file) {
        // TODO: Add this to config
        if (file.size > 50000000) {
          errors.push('File larger than 50mb file size limit.');
        } else {
          const fileExtPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;
          let fileExt = ((file.originalname || '').match(fileExtPattern) || [])[0] || '';
          // Keep file extensions to 5 chars
          if (fileExt.length > 5) fileExt.length = 5;
          data.fileName = key + fileExt;
          fs.writeFileSync(`server/uploads/${data.fileName}`, file.buffer);
        }
      }
    } catch(e) {
      errors.push('Problem uploading file. Please try again later.');
      winston.error('File error: ' + e);
    }

    // If there any errors, end the processing
    // TODO: format to use this.fail()
    if (errors.length) {
      res.writeHead(400, DocHandler.contentType.json);
      res.end(JSON.stringify(errors));
      return;
    }

    /**
     * Do some formatting
     *
     * TODO: Move all validation functionality to the shared folder so it's
     * consistent across client and server
     **/
    // Make sure privacy is a proper value
    data.privacy = (Object.keys(privacyOptions).includes(data.privacy)) ?
      data.privacy : privacyOptions.public;
    // Create expiration timestamp
    // TODO: this should be enumerated in the shared folder
    data.expiration =
      (['30 minutes', '6 hours', '1 days', '1 weeks', '1 months'].includes(data.expiration)) ?
        postgresTimestamp(data.expiration) : null;

    // Insert the query
    const queryInserted = await this.store.insert(key, data);

    if (queryInserted) {
      winston.verbose('Added document: ', { key });
      res.writeHead(200, DocHandler.contentType.json);
      res.end(JSON.stringify({ key }));
    } else {
      this.fail({
        clientMsg: 'Problem adding document. Please try again later.',
        serverMsg: 'Error adding document for key: ' + key,
        resCode: 500
      });
    }
  };

  /**
   * Create a random key that doesn't already exist in the database.
   * @returns string
   */
  async chooseKey() {
    let foundKey = false;
    while (!foundKey) {
      let key = this.keyGenerator.createKey();
      let keyExists = await this.store.getByKey(key);
      if (!keyExists) {
        return key;
      }
    }
  }

}

export default DocHandler;
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
import { fileValidation, pasteValidation } from '../../shared/validations/paste';
import { mime2ext } from '../../shared/modules/mime2ext';

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
  static getFilePath = filename => {
    const filePath = path.join(__dirname, `../uploads/${filename}`);
    return (fs.existsSync(filePath)) ? filePath : null;
  };

  constructor() {
    this.store = new PostgresStore();
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
    if (data && (data.text || (data.filename && DocHandler.getFilePath(data.filename)))) {
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

    // Don't return raw docs that are encrypted
    if (data && data.text && data.privacy != privacyOptions.encrypted) {
      winston.verbose('Retrieved raw document', { key });
      res.writeHead(200, DocHandler.contentType.plain);
      res.end(data.text);
    }

    this.fail(res, {
      clientMsg: 'Document not found.',
      serverMsg: 'RawGet: Document not found.'
    });
  }

  /**
   * TODO: check the database to make sure the paste hasn't expired
   * @param filename
   * @param res
   */
  handleGetFile(filename, res) {
    const filePath = path.join(__dirname, `../uploads/${filename}`);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }

    this.fail(res, {
      clientMsg: 'File not found.',
      serverMsg: 'Problem serving file: ' + e,
    });
  }

  async handleGetList(req, res) {
    const data = await this.store.getList();
    winston.verbose('Retrieving document list.');
    res.writeHead(200, DocHandler.contentType.plain);
    res.end(JSON.stringify(data));
  }

  async handlePost(req, res) {
    let data = req.body;
    data.file = req.files[0];

    // First do some basic validation on the paste we received
    const validate = pasteValidation(data);
    if (!validate.passed) {
      return this.fail(res, {
        resCode: 500,
        clientMsg: validate.errors,
        serverMsg: 'Server validation failure for ...'
      });
    }

    // Generate a new key
    const key = await this.chooseKey();

    // Try writing the file if it exists
    try {
      if (data.file) {
        data.filename = key + mime2ext[data.file.mimetype];
        fs.writeFileSync(`server/uploads/${data.filename}`, data.file.buffer);
      }
    } catch(e) {
      return this.fail({
        resCode: 500,
        clientMsg: 'Problem uploading file. Please try again later.',
        serverMsg: 'File error: ' + e
      });
    }

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
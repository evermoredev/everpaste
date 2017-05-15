import fs from 'fs';
import path from 'path';
import winston from 'winston';

import { postgresTimestamp } from '../modules/_helpers';
import { contentType, fail } from '../modules/response';
import { expirationOptions, privacyOptions } from '../../shared/config/constants';
import { fileValidation, pasteValidation } from '../../shared/validations/paste';
import { mime2ext } from '../../shared/modules/mime2ext';

/**
 * Class for handling all the api calls for the pastebin
 */
class ApiController {

  // Returns the proper file path if the file exists
  static getFilePath(filename) {
    const filePath = path.join(__dirname, `../uploads/${filename}`);
    return (fs.existsSync(filePath)) ? filePath : null;
  }

  constructor(db) { 
    this.db = db;
  }
  
  async handleGet(key, res, options = {}) {
    const data = await this.db.models.entries.getEntry(key);

    // Return the data object if there's text available or if it's a file paste
    // and the file still exists
    const stillExists = data &&
      (data.text || (data.filename && ApiController.getFilePath(data.filename)));

    // Send back data the paste was forked from
    if (stillExists && data.forkedKey) {
      const forkedData = await this.db.models.entries.getEntry(data.forkedKey);
      if (forkedData && forkedData.text && forkedData.privacy != privacyOptions.encrypted) {
        data.forkedText = forkedData.text;
      } else {
        // Send back no forked key
        data.forkedKey = null;
      }
    }

    if (stillExists) {
      winston.verbose('Retrieved document', { key });
      res.end(JSON.stringify(data));
    } else {
      winston.warn('Document not found', { key });
      res.writeHead(404, contentType.json);
      res.end(JSON.stringify({ message: 'Document not found.' }));
    }
  }

  async handleRawGet(key, res) {
    const data = await this.db.models.entries.getEntry(key);

    // Don't return raw docs that are encrypted
    if (data && data.text && data.privacy != privacyOptions.encrypted) {
      winston.verbose('Retrieved raw document', { key });
      res.writeHead(200, contentType.plain);
      res.end(data.text);
    }

    fail(res, {
      clientMsg: 'Document not found.',
      serverMsg: 'RawGet: Document not found.'
    });
  }

  /**
   * @param key
   * @param res
   */
  async handleGetFile(key, res) {
    const data = await this.db.models.entries.getEntry(key);

    if (data && data.filename) {
      const filePath = path.join(__dirname, `../uploads/${data.filename}`);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    }

    fail(res, {
      clientMsg: 'File not found.',
      serverMsg: 'Problem serving file: ' + key,
    });
  }

  async handleGetList(req, res) {
    const data = await this.db.models.entries.getAll();
    winston.verbose('Retrieving document list.');
    res.writeHead(200, contentType.plain);
    res.end(JSON.stringify(data));
  }

  /**
   * Handles post requests to /api
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  async handlePost(req, res) {
    const data = req.body,
          isCurl = req.headers['user-agent'].includes('curl'),
          host = req.headers.host;

    data.file = (req.files) ?  req.files[0] : null;

    // Do some handling here in case of posting using curl
    if (isCurl) {
      data.expiration = (!data.expiration) ? 'Forever' : data.expiration;
      data.privacy = (!data.privacy) ? privacyOptions.private : data.privacy;
    }

    // First do some basic validation on the paste we received
    const validate = pasteValidation(data);
    if (!validate.passed) {
      return fail(res, {
        resCode: 500,
        clientMsg: validate.errors,
        serverMsg: 'Server validation failure for ...'
      });
    }

    // Generate a new key
    data.key = await this.db.models.entries.createKey();

    // Try writing the file if it exists
    try {
      if (data.file) {
        data.filename = data.key + mime2ext[data.file.mimetype];
        fs.writeFileSync(`server/uploads/${data.filename}`, data.file.buffer);
      }
    } catch(e) {
      return fail(res, {
        resCode: 500,
        clientMsg: 'Problem uploading file. Please try again later.',
        serverMsg: 'File error: ' + e
      });
    }

    // Create expiration timestamp or null for no expiration
    data.expiration = (data.expiration != 'Forever') ?
      postgresTimestamp(data.expiration) : null;

    // Insert the query
    const created = await this.db.createSync('entries', data);

    // If using curl, send back a url in plain text to the paste
    if (created && isCurl) {
      winston.verbose('Added document via curl: ', { key: data.key });
      res.writeHead(200, contentType.plain);
      return res.end(`${host}/${data.key}`);
    }
    // Otherwise a JSON response for the webapp to handle
    else if (created) {
      winston.verbose('Added document: ', { key: data.key });
      res.writeHead(200, contentType.json);
      return res.end(JSON.stringify({ key: data.key }));
    }

    // Fail if we make it here
    fail(res, {
      clientMsg: 'Problem adding document. Please try again later.',
      serverMsg: 'Error adding document for key: ' + data.key,
      resCode: 500
    });

  };

}

export default ApiController;

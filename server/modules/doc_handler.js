/**
 * Handles saving and retrieving documents from the store.
 *
 * TODO:
 *   - More error handling and logging
 */

import winston from 'winston';
import PostgresStore from './postgres_store';
import KeyGenerator from './key_generator';
import Config from '../../config';
import { privacyOptions } from '../config/constants';
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

  constructor() {
    this.store = PostgresStore;
    this.maxLength = Config.maxLength;
    this.keyGenerator = KeyGenerator;
  }

  async handleGet(docKey, res, options = {}) {
    const { key, lang } = DocHandler.splitDocKey(docKey);
    const data = await this.store.getByKey(key);
    if (data && data.text) {
      winston.verbose('Retrieved document', { key });
      res.end(JSON.stringify(data));
    } else {
      winston.warn('Document not found', { key });
      res.writeHead(404, DocHandler.contentType.json);
      res.end(JSON.stringify({ message: 'Document not found.' }));
    }
  }

  async handleRawGet(docKey, res) {
    const { key, lang } = DocHandler.splitDocKey(docKey);
    const data = await this.store.getByKey(key);
    if (data && data.text) {
      winston.verbose('Retrieved raw document', { key });
      res.writeHead(200, DocHandler.contentType.plain);
      res.end(data.text);
    } else {
      winston.warn('Raw document not found', { key });
      res.writeHead(404, DocHandler.contentType.json);
      res.end(JSON.stringify({ message: 'Document not found.' }));
    }
  }

  async handleGetList(req, res) {
    const data = await this.store.getList();
    if (data) {
      winston.verbose('Retrieving document list.');
      res.writeHead(200, DocHandler.contentType.plain);
      res.end(JSON.stringify(data));
    } else {
      winston.warn('Retrieved empty list.');
      res.writeHead(404, DocHandler.contentType.json);
      res.end(JSON.stringify({ message: 'Empty list.' }));
    }
  }

  async handlePost(req, res) {
    let data = req.body;

    /**
     * Do some validation
     **/
    const errors = [];

    if (data.text.length > this.maxLength) {
      winston.warn('Document exceeds max length.', {maxLength: this.maxLength});
      errors.push('Document exceeds max length.');
    }
    if (!data.text) {
      winston.warn('No text data for document.');
      errors.push('No text data for document.');
    }

    if (errors.length) {
      res.writeHead(400, DocHandler.contentType.json);
      res.end(JSON.stringify(errors));
      return;
    }

    /**
     * Do some formatting
     **/
    // Make sure privacyOption is a proper value
    data.privacyOption = (Object.keys(privacyOptions).includes(data.privacyOption)) ?
      data.privacyOption : privacyOptions.public;
    // Create expiration timestamp
    data.expiration =
      (['30 minutes', '6 hours', '1 days', '1 weeks', '1 months'].includes(data.expiration)) ?
        postgresTimestamp(data.expiration) : null;

    // Generate a new key
    const key = await this.chooseKey();
    // Insert the query
    const queryInserted = await this.store.insert(key, data);

    if (queryInserted) {
      winston.verbose('Added document: ', { key });
      res.writeHead(200, DocHandler.contentType.json);
      res.end(JSON.stringify({ key }));
    } else {
      winston.verbose('Error adding document: ', { key });
      res.writeHead(500, DocHandler.contentType.json);
      res.end(JSON.stringify({ message: 'Error adding document.' }));
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

export default new DocHandler();
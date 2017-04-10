/**
 * This module creates a connection to postgres and executes queries.
 * Wrapped connections in promises for async/await use.
 *
 * TODO:
 *   - Set up some try/catch blocks and winston for connection errors
 */

import postgres from 'pg';
import config from '../config/config';
import { privacyOptions } from '../../shared/config/constants';
import { postgresTimestamp } from './_helpers';

class PostgresStore {

  constructor() {
    this.connectionUrl = config.storage.connectionUrl;
  }

  async insert(key, data, options = {}) {
      const queryString = 'INSERT INTO entries (key, text, privacy, name, title, expiration, filename) VALUES ($1, $2, $3, $4, $5, $6, $7)';
      const queryKeys = [key, data.text, data.privacy, data.name, data.title, data.expiration, data.filename];
      return await this.query(queryString, queryKeys);
  }

 async getByKey(key, options = {}) {
      const now = postgresTimestamp();
      const queryString = 'SELECT * from entries where KEY = $1 and (expiration IS NULL or expiration > $2)';
      const queryKeys = [key, now];
      const { rows } = await this.query(queryString, queryKeys);
      return rows.length ? rows[0] : false;
  }

  async getList() {
      const now = postgresTimestamp();
      const queryString = 'SELECT * from entries where privacy = $1 and (expiration IS NULL or expiration > $2)';
      const queryKeys = [privacyOptions.public, now];
      const { rows } = await this.query(queryString, queryKeys);
      return rows.length ? rows : false;
  }

  /**
   * Wrap some postgres functions in promises
   */
  connect() {
    return new Promise((resolve, reject) => {
      postgres.connect(this.connectionUrl, (err, client, done) => {
        (err) ? reject(err) : resolve({ client, done });
      })
    });
  }

  query(queryString, queryKeys) {
    return new Promise(async (resolve, reject) => {
      const { client, done } = await this.connect();
      client.query(queryString, queryKeys, (err, res) => {
        (err) ? reject(err) : resolve(res);
        done();
      });
    });
  }
}

export default PostgresStore;

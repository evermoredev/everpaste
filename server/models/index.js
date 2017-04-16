/**
 * This file automatically loads all the models listed in the same directory.
 * It also adds some additional functionality to each model. See createSync()
 */

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import winston from 'winston';

import serverConfig from '../config/config';

class Database {

  constructor() {
    this.sequelize = new Sequelize(serverConfig.storage.connectionUrl);
    this.sequelize.query("SET TIME ZONE 'UTC'");
    this.models = {};
  }

  /**
   * To be run when the server starts. First tests the connection, then loads
   * all the model files in this modules directory.
   * @returns {Promise}
   */
  async loadModels() {
    await this.testConnection();

    // List all the files in this directory
    fs.readdirSync(__dirname).forEach(file => {
      // Don't load this file, index.js
      if (file == 'index.js') return;

      winston.info('Loading model: ' + file);
      const data = require(path.join(__dirname, file));

      // Get the model definition and add it to "db"
      const model = data.default(this.sequelize, this.models);
      this.models[model.name] = model;

      // This is copied from sequelize docs.. have to check on associations.
      if ("associate" in this.models[model.name]) {
        this.models[model.name].associate(this.models);
      }

    });
  }

  /**
   * Sequelize doesn't provide a synchronous create. For now, make one on the
   * database object instead of every model.
   * @param {string} modelName
   * @param {object} data
   * @returns {Promise} instead of rejecting on error, just resolves false
   */
  async createSync(modelName, data) {
    return new Promise((resolve, reject) => {
      this.models[modelName].create(data)
        .then(() => resolve(true))
        .catch((e) => {
          winston.error(
            `An error occurred while trying to create in ${modelName}: `, e
          );
          resolve(false);
        });
    });
  }

  /**
   * Tests the database connection to make sure there's proper authentication
   * @returns {Promise}
   */
  async testConnection() {
    return new Promise((resolve, reject) => {
      this.sequelize
        .authenticate()
        .then(() => {
          winston.info('Database authenticated.');
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

}

export default Database;

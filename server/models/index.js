/**
 * This file automatically loads all the models listed in the same directory.
 * It also adds some additional functionality to each model. See createSync()
 */

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import winston from 'winston';

import serverConfig from '../config/config';

// database connection
const sequelize = new Sequelize(serverConfig.storage.connectionUrl);
const db = {};

// List all the files in this directory
fs.readdirSync(__dirname).forEach(file => {
  // Don't load this file, index.js
  if (file == 'index.js') return;

  winston.info('Loading model: ' + file);
  const data = require(path.join(__dirname, file));

  // Get the model definition and add it to "db"
  const model = data.default(sequelize, db);
  db[model.name] = model;

  // This is copied from sequelize docs.. have to check on associations.
  if ("associate" in db[model.name]) {
    db[model.name].associate(db);
  }

  // Give every model a synchronous create
  db[model.name].createSync = (data) => {
    return new Promise((resolve, reject) => {
      db[model.name].create(data)
        .then(() => resolve(true))
        .catch((e) => {
          winston.error(
            `An error occurred while trying to create in ${model.name}: `, e
          );
          resolve(false);
        });
    });
  }

});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

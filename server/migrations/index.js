import fs from 'fs';
import winston from 'winston';
import postgres from 'pg';
import serverConfig from '../config/config';

/**
 * Class for handling migration files from the file system.
 */
class Migrations {

  /**
   * Create a migration instance.
   */
  constructor() {
    // Holds the imported migrations objects
    this.migrations = [];

    // List all the files in this directory
    fs.readdir(__dirname, (err, items) => {
      items.forEach(item => {
        // Don't load this file, index.js
        if (item == 'index.js') return;

        winston.info(`Reading migration from ./${item}`);
        let m = require(`./${item}`);
        if (!m.name || !m.up || !m.down) {
          throw Error('Migration found without one of: name, up, or down string.');
        }
        this.migrations.push(m);
      });
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      postgres.connect(serverConfig.storage.connectionUrl, (err, client, done) => {
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

  /**
   * Gets the migrations table. Creates the table if it doesn't exist.
   * @returns {object} The migration row containing the current property.
   */
  async getMigrationsTable() {

    try {
      await this.query(`
        CREATE TABLE IF NOT EXISTS migrations
        (id serial primary key,
          current integer default 0,
          created timestamp default clock_timestamp());
      `);
    } catch(e) {
      // Even "IF NOT EXISTS" still throws an error for PG
      // http://www.postgresql-archive.org/Errors-on-CREATE-TABLE-IF-NOT-EXISTS-td5659080.html
    }

    // Get the migration information from the database
    let { rows } = await this.query('SELECT * FROM migrations');

    // If it doesn't exist, create a row
    if (!rows.length) {
      winston.info('No migration data found. Setting up a migration row.');
      await this.query(`INSERT INTO migrations (current) VALUES (0);`);
      let result = await this.query('SELECT * FROM migrations');
      rows = result.rows;
    }

    // Return only the first row (There should only be one.)
    return rows[0];
  }

  /**
   * Sets the current migration index
   * @param {number} value
   */
  async setCurrent(value) {
    await this.query(`UPDATE migrations SET current = ${value}`);
  }

  /**
   * Run the up migrations to {upTo}. Default to all the migrations
   * in this.migrations.
   * @param  {number} upTo
   * @returns {boolean} true if migrations were run
   */
  async up(upTo = this.migrations.length) {
    const migrationTable = await this.getMigrationsTable();

    // Exit if current
    if (migrationTable.current >= upTo) {
      winston.info('Migrations are current.');
      return false;
    }

    // Run the up migrations
    for (let i = migrationTable.current+1; i <= upTo; i++) {
      winston.info(`Running Up Migrations for: ${this.migrations[i-1].name}`);
      await this.query(this.migrations[i-1].up);
    }

    // Set the current migration number
    await this.setCurrent(upTo);
    return true;
  }

  /**
   * Run the down migrations down to {downTo}. Default to 0
   * @param  {number} downTo
   * @returns {boolean} true if migrations were run
   */
  async down(downTo = 0) {
    const migrationTable = await this.getMigrationsTable();

    // Exit if current
    if (migrationTable.current <= downTo) return false;

    // Run the down migrations
    for (let i = migrationTable.current; i > 0; i--) {
      winston.info(`Running Down Migrations for: ${this.migrations[i-1].name}`);
      await this.query(this.migrations[i-1].down);
    }

    // Set the current migration number
    await this.setCurrent(downTo);
    return true;
  }

}

export default Migrations;

import fs from 'fs';
import winston from 'winston';

import PostgresStore from '../modules/postgres_store';

class Migrations {

  constructor() {
    this.store = new PostgresStore();
    this.migrations = [];

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


  /**
   * Gets the migrations table. Creates the table if it doesn't exist.
   */
  async getMigrationsTable() {

    try {
      await this.store.query(`
        CREATE TABLE IF NOT EXISTS migrations
        (id serial primary key,
          current integer default 0,
          created timestamp default clock_timestamp());
      `);
    } catch(e) {
      // Even "IF NOT EXISTS" still throws an error for PG
      // http://www.postgresql-archive.org/Errors-on-CREATE-TABLE-IF-NOT-EXISTS-td5659080.html
    }

    let { rows } = await this.store.query('SELECT * FROM migrations');

    if (!rows.length) {
      winston.info('No migration data found. Setting up a migration row.');
      await this.store.query(`INSERT INTO migrations (current) VALUES (0);`);
      let result = await this.store.query('SELECT * FROM migrations');
      rows = result.rows;
    }

    return rows[0];
  }

  /**
   * Sets the current migration index
   * @param value
   */
  async setCurrent(value) {
    await this.store.query(`UPDATE migrations SET current = ${value}`);
  }

  /**
   * Run the up migrations to {upTo}. Default to all the migrations in this.migrations.
   * @param upTo
   */
  async up(upTo = this.migrations.length) {
    const migrationTable = await this.getMigrationsTable();

    // Exit if current
    if (migrationTable.current >= upTo) {
      winston.info('Migrations are current.');
      return Promise.resolve(false);
    }

    for (let i = migrationTable.current+1; i <= upTo; i++) {
      winston.info(`Running Up Migrations for: ${this.migrations[i-1].name}`);
      await this.store.query(this.migrations[i-1].up);
    }

    await this.setCurrent(upTo);
    return Promise.resolve(true);
  }

  /**
   * Run the down migrations down to {downTo}. Default to 0
   * @param downTo
   */
  async down(downTo = 0) {
    const migrationTable = await this.getMigrationsTable();

    // Exit if current
    if (migrationTable.current <= downTo) Promise.resolve(false);

    // Don't reverse the original array
    for (let i = migrationTable.current; i > 0; i--) {
      winston.info(`Running Down Migrations for: ${this.migrations[i-1].name}`);
      await this.store.query(this.migrations[i-1].down);
    }

    await this.setCurrent(downTo);
    return Promise.resolve(true);
  }

}

export default Migrations;

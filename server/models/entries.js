import Sequelize from 'sequelize';
import { postgresTimestamp } from '../modules/_helpers';
import { privacyOptions } from '../../shared/config/constants';
import RandomKeyGenerator from '../modules/key_generator';

/**
 * Returns a sequelize model definition to be added to the db instance.
 * Adds additional helper methods to the object prototype that are not
 * part of the sequelize api
 * @param sequelize - the current instance of sequelize, such that we don't need
 *   to establish a new connection
 * @param db - the instance of the database that all the models are being
 *   attached to. Allows us to access the model we're defining here in the
 *   helper methods.
 * @returns {object} a sequelize model definition with helper methods
 */
export default (sequelize, db) => {
  /**
   * Define the sequelize model. The name of the model is the first arg of
   * sequelize.define
   */
  const entries = sequelize.define('entries', {
    key: Sequelize.STRING,
    text: Sequelize.TEXT,
    privacy: Sequelize.STRING,
    name: Sequelize.STRING,
    title: Sequelize.STRING,
    filename: Sequelize.STRING,
    expiration: Sequelize.STRING,
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at'
    }

  }, {
    scopes: {
      available: () => ({
        where: {
          $or: [
            {
              expiration: { $gt: sequelize.fn('NOW') }
            },
            {
              expiration: null
            }
          ]
        }
      })
    }
  });

  /**
   * Helper method to retrieve the raw data from the entries table
   * @param key
   */
  entries.getEntry = (key) => {
    return new Promise((resolve, reject) => {
      db.entries.scope('available').find({ raw: true, where: { key }})
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  };

  /**
   * Returns a list of all the public entries
   */
  entries.getAll = () => {
    return new Promise((resolve, reject) => {
      db.entries.scope('available').findAll({
        raw: true,
        where: {
          privacy: privacyOptions.public
        }
      })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  };

  /**
   * Create a random key that doesn't already exist in the database.
   * @returns string
   */
  entries.createKey = async () => {
    const keyGen = new RandomKeyGenerator();
    let foundKey = false;
    while (!foundKey) {
      let key = keyGen.createKey();
      let keyExists = await db.entries.getEntry(key);
      if (!keyExists) {
        return key;
      }
    }
  };

  return entries;
};

/**
 * This config data is read by most of the server modules.
 * Rename this file to config.js before running for the first time.
 *
 * In some cases, environment variables will take precedence so be sure to
 * pay attention to that.
 */

const config = {

  /**
   * Server information
   * @host String Application server host
   * @port Application server port
   * @production Determine whether or not the application is in production mode.
   * @development Will be in development mode for any other string
   */
  "host": process.env.HOST || "0.0.0.0",
  "port": process.env.PORT || 4000,
  "production": process.env.NODE_ENV == "production",
  "development": process.env.NODE_ENV != "production",

  /**
   * The following are SSL options. Only uncomment this if you have
   * already configured SSL on your machine. This will only be used for
   * production environments.
   *
   * @sslEnabled Boolean Tells server.js to expect ssl configuration for production
   */
  "sslEnabled": true,
  "sslPort": process.env.SSL_PORT || 443,
  "certPrivateKey": "/etc/letsencrypt/live/mysite.com/privkey.pem",
  "certChain": "/etc/letsencrypt/live/mysite.com/fullchain.pem",
  "certCa": "/etc/letsencrypt/live/mysite.com/chain.pem",

  /**
   * Document information and static assets
   * @title Will appear in the header and as window title
   * @maxLength int Maximum characters for a Paste, currently set to 50mb
   * @staticMaxAge int Caching age for static documents
   *
   * To change the favicon, simply replace the one in the public/ directory
   * The logo in the header can be replaced in public/img
   */
  "title": "My PasteBin",
  "maxLength": "50mb",
  "staticMaxAge": 86400,

  /**
   * Key Generator information.
   * @keyLength is an int for the size of the document key that will be used
   *  to identify documents in the url
   * @keyChars is a set of characters that will be chosen at random to generate
   *   the key.
   *   Cannot use the . character, as this is a delimiter for the language type
   */
  "keyGenerator": {
    keyLength: 10,
    keyChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  },

  /**
   * To configure Winston logging
   */
  "logging": [
    {
      "level": "verbose",
      "type": "Console",
      "colorize": true
    }
  ],

  /**
   * Configure rate limits for connect
   */
  "rateLimits": {
    "categories": {
      "normal": {
        "totalRequests": 500,
        "every": 60000
      }
    }
  },

  /**
   * Database storage
   * @type String Changing this won't do anything at the moment but would like
   *   to eventually allow different storage types
   * @connectionUrl String Database connection string - replace username,
   *   password, dbhost, and dbname
   */
  "storage": {
    "type": "postgres",
    "connectionUrl": process.env.CONNECTION_URL || "postgres://username:password@dbhost:5432/dbname"
  }

};

export default config;

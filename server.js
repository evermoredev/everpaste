import bodyParser from 'body-parser';
import child_process from 'child_process';
import cluster from 'cluster';
import compression from 'compression';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import limiter from 'connect-ratelimit';
import multer from 'multer';
import os from 'os';
import path from 'path';
import webpack from 'webpack';
import winston from 'winston';

import compile from './server/config/compile';
import serverConfig from './server/config/config';
import webpackConfig from './server/config/webpack.config';
import ApiController from './server/controllers/api_controller';
import Migrations from './server/migrations';
import Database from './server/models';

/**
 * Class for combining all the elements needed to run a NodeJS server
 */
class Server {

  // Allow these root paths to pass through otherwise serve the app (index.html)
  static passThrough = (url) => (/^\/(sockjs-node|js|img)\//).test(url);

  constructor() {
    this.app = express();
  }

  static removeBuildFiles() {
    // This is relative to where you start the server
    const command = 'rm -f ./public/js/app.* && rm -f ./public/index.html';
    child_process.execSync(command);
  }

  /**
   * Sets up the database and loads the models.
   * @returns {Promise}
   */
  async database() {
    this.db = new Database();
    await this.db.loadModels();
  }

  /**
   * Sets up logging for the application
   */
  logging() {
    // Set up the logger
    if (serverConfig.logging) {
      try {
        winston.remove(winston.transports.Console);
      } catch(er) { }
      let detail, type;
      for (let i = 0; i < serverConfig.logging.length; i++) {
        detail = serverConfig.logging[i];
        type = detail.type;
        delete detail.type;
        winston.add(winston.transports[type], detail);
      }
    }
  }

  /**
   * Applies all the middleware to the instance of app
   */
  middleware() {
    // gzip http payloads
    this.app.use(compression());

    // Add some default security like removing x-powered-by headers,
    // sniffing of MIME types, frameguard protection, and a bit more.
    this.app.use(helmet());

    // Set up location to serve static files
    this.app.use(express.static(__dirname + '/public'));
    this.app.use(bodyParser.json());

    // for parsing application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({
      limit: serverConfig.maxLength,
      extended: true
    }));

    // Rate limit all requests
    if (serverConfig.rateLimits) {
      serverConfig.rateLimits.end = true;
      this.app.use(limiter(serverConfig.rateLimits));
    }

    // Cross-origin requests
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
  }

  controllers() {
    this.apiController = new ApiController(this.db);
  }

  /**
   * Runs migrations
   *
   * WARNING: Uncommenting the migrations.down() will probably cause loss of
   * data. Not for production.
   */
  static async migrations() {
    // Make sure migrations only run once
    const migration = new Migrations();
    // await migration.down();
    await migration.up();
  }

  /**
   * Sets up all the routes for the application
   * Uses multer for file uploads
   */
  routing() {
    // multer for file uploads
    const upload = multer({ storage: multer.memoryStorage() }).any();
    // api calls for the server to handle
    this.app.post('/api/:id/plantuml',
      (req, res) =>
        upload(req, res, (err) => this.apiController.handlePostPlantUml(req, res)));
    this.app.post('/api',
      (req, res) =>
        upload(req, res, (err) => this.apiController.handlePost(req, res)));
    this.app.get('/api/list',
      (req, res) => this.apiController.handleGetList(req, res));
    this.app.get('/api/file/:key/:filename',
      (req, res) => this.apiController.handleGetFile(req.params, res));
    this.app.get('/api/:id',
      (req, res) => this.apiController.handleGet(req.params.id, res));
  }

  /**
   * Runs the server in development mode.
   */
  runDevServer() {
    const webpackPrepped =
      webpack(require('./server/config/webpack.config'));
    this.app.use('*', (req, res, next) => {
      if (Server.passThrough(req.originalUrl)) {
        next();
      } else {
        const filename = path.join(webpackPrepped.outputPath, 'index.html');
        webpackPrepped.outputFileSystem.readFile(filename, (err, result) => {
          if (err) return next(err);
          res.set('content-type','text/html');
          res.send(result);
          res.end();
        });
      }
    });

    this.app.use(require('webpack-dev-middleware')(webpackPrepped, {
      publicPath: webpackConfig.output.publicPath,
      hot: true,
      historyApiFallback: true
    }));
    const server = new http.Server(this.app);
    server.listen(serverConfig.port, serverConfig.host, (err, res) => {
      if (err) winston.error(err);
      winston.info('Development: listening on '
        + serverConfig.host + ':' + serverConfig.port);
    });
  }

  /**
   * Runs the server in production mode.
   */
  runProdServer() {
    // remove old files and compile new ones
    const webpackPrepped =
      webpack(require('./server/config/webpack.production.config'));
    compile(webpackPrepped);
    this.app.use('*', (req, res, next) => {
      if (Server.passThrough(req.originalUrl)) {
        next();
      } else {
        res.sendFile(path.join(__dirname + '/public/index.html'));
      }
    });
    // With SSL enabled
    if (serverConfig.sslEnabled) {
      // Redirect to https
      http.createServer((req, res) => {
        res.writeHead(301,
          {"Location": "https://" + req.headers['host'] + req.url});
        res.end();
      }).listen(serverConfig.port);

      // SSL Cert options
      const options = {
        key: fs.readFileSync(serverConfig.certPrivateKey),
        cert: fs.readFileSync(serverConfig.certChain),
        ca: fs.readFileSync(serverConfig.certCa)
      };

      https.Server(options, this.app)
        .listen(serverConfig.sslPort, (err, res) => {
          if (err) winston.error(err);
          winston.info('Production with SSL: listening on '
            + serverConfig.host + ':' + serverConfig.sslPort);
      });
    } else {
      http.createServer(this.app)
        .listen(serverConfig.port, serverConfig.host, (err, res) => {
          if (err) winston.error(err);
          winston.info('Production: listening on '
            + serverConfig.host + ':' + serverConfig.port);
      });
    }
  }

  /**
   * This sets up the server with things that only need to happen once in case
   * of multiple processes. For example, we don't want to run migrations for
   * each child process.
   * @returns {Promise.<void>}
   */
  static async initialize() {
    await Server.migrations();
    Server.removeBuildFiles();
  };

  /**
   * Builds and runs the server based on the current configuration
   */
  async run() {
    // Database operations. Comment these out if there's no database
    await this.database();
    // Logging and middleware
    this.logging();
    this.middleware();
    // Set up controllers and routing
    this.controllers();
    this.routing();
    // Start the server
    if (serverConfig.production) {
      this.runProdServer();
    } else {
      this.runDevServer();
    }
  }
}


/**
 * Run an instance of the production server for each cpu
 */
if (cluster.isMaster) {
  Server.initialize().then(() => {
    if (serverConfig.production) {
      os.cpus().forEach((cpu) => {
        winston.info(`Starting node worker on ${cpu.model}`);
        cluster.fork();
      });
    } else {
      const server = new Server();
      server.run();
    }
  });
} else {
  const server = new Server();
  server.run();
}

import bodyParser from 'body-parser';
import cluster from 'cluster';
import compression from 'compression';
import express from 'express';
import fs from 'fs';
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
  async migrations() {
    const migrations = new Migrations();
    // await migrations.down();
    await migrations.up();
  }

  /**
   * Sets up all the routes for the application
   * Uses multer for file uploads
   */
  routing() {
    // multer for file uploads
    let upload  = multer({ storage: multer.memoryStorage() }).any();
    // api calls for the server to handle
    this.app.post('/api',
      (req, res) =>
        upload(req, res, (err) => this.apiController.handlePost(req, res)));
    this.app.get('/api/list',
      (req, res) => this.apiController.handleGetList(req, res));
    this.app.get('/api/file/:id',
      (req, res) => this.apiController.handleGetFile(req.params.id, res));
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
   * Builds and runs the server based on the current configuration
   */
  async run() {
    // Database operations. Comment these out if there's no database
    await this.database();
    await this.migrations();
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
 * If this is the production server, utilize all the cpus
 */
if (serverConfig.production) {

  if (cluster.isMaster) {
    // Start workers and listen for messages containing notifyRequest
    os.cpus().forEach((cpu) => {
      winston.info(`Starting node worker on ${cpu.model}`);
      cluster.fork();
    });
  } else {
    // Run an instance of a server on each cluster
    const server = new Server();
    server.run();
  }

} else {
  // Dev server
  const server = new Server();
  server.run();
}

import winston from 'winston';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import path from 'path';
import limiter from 'connect-ratelimit';

import config from './server/config/config';
import DocHandler from './server/modules/doc_handler';

import webpack from 'webpack';
import webpackConfig from './server/config/webpack.config';
import compile from './server/config/compile';

// Prep webpack based on our environment
const webpackPrepped = config.production ?
  webpack(require('./server/config/webpack.production.config')) :
  webpack(require('./server/config/webpack.config'));

// Create the app
const app = express();
const docHandler = new DocHandler();

app.use(express.static(__dirname + '/public'));

// Set up the logger
if (config.logging) {
  try {
    winston.remove(winston.transports.Console);
  } catch(er) { }
  let detail, type;
  for (let i = 0; i < config.logging.length; i++) {
    detail = config.logging[i];
    type = detail.type;
    delete detail.type;
    winston.add(winston.transports[type], detail);
  }
}

// for parsing application/json
app.use(bodyParser.json({ limit: config.maxLength }));
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limit all requests
if (config.rateLimits) {
  config.rateLimits.end = true;
  app.use(limiter(config.rateLimits));
}

/**
 * Cross-origin requests
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**
 * Set up some routing
 */

// api calls for the server to handle
app.post('/api', (req, res) => docHandler.handlePost(req, res));
app.get('/api/list', (req, res) => docHandler.handleGetList(req, res));
app.get('/api/:id', (req, res) => docHandler.handleGet(req.params.id, res));

// Allow these root paths to pass through otherwise serve the app (index.html)
const passThrough = (url) => (/^\/(sockjs-node|js|img)\//).test(url);

/**
 * Development mode
 */
if (config.development) {
  app.use('*', (req, res, next) => {
    if (passThrough(req.originalUrl)) {
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

  app.use(require('webpack-dev-middleware')(webpackPrepped, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
  }));
  const server = new http.Server(app);
  server.listen(config.port, config.host, (err, res) => {
    if (err) winston.error(err);
    winston.info('Development: listening on ' + config.host + ':' + config.port);
  });

}

/**
 * Production mode
 */
if (config.production) {
  // remove old files and compile new ones
  compile(webpackPrepped);
  app.use('*', (req, res, next) => {
    if (passThrough(req.originalUrl)) {
      next();
    } else {
      res.sendFile(path.join(__dirname + '/public/index.html'));
    }
  });
  // With SSL enabled
  if (config.sslEnabled) {
    // Redirect to https
    http.createServer((req, res) => {
      res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
      res.end();
    }).listen(config.port);
    // SSL Cert options
    options = {
      key: fs.readFileSync(config.certPrivateKey),
      cert: fs.readFileSync(config.certChain),
      ca: fs.readFileSync(config.certCa)
    };
    https.Server(options, app).listen(config.sslPort, (err, res) => {
      if (err) winston.error(err);
      winston.info('Production with SSL: listening on ' + config.host + ':' + config.sslPort);
    });
  } else {
    http.createServer(app).listen(config.port, config.host, (err, res) => {
      if (err) winston.error(err);
      winston.info('Production: listening on ' + config.host + ':' + config.port);
    });
  }
}

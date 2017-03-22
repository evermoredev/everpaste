import winston from 'winston';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import path from 'path';
import limiter from 'connect-ratelimit';

import docHandler from './server/modules/doc_handler';

import config from './server/config/config';

import webpack from 'webpack';
import webpackConfig from './server/config/webpack.config';
const webpackCompiled = webpack(webpackConfig);

/**
 * Tell any CSS tooling (such as Material UI) to use all vendor
 * prefixes if the user agent is not known.
 */
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

// Server-side only global environment variables
global.__IS_DEVELOPMENT__ = process.env.NODE_ENV === 'development';
global.__IS_CLIENT__ = false;
global.__IS_SERVER__ = true;

const isDeveloping = process.env.NODE_ENV !== 'production';


// Load the configuration and set some defaults
config.port = process.env.PORT || config.port || 7777;
config.host = process.env.HOST || config.host || 'localhost';

// Create the app, setup the webpack middleware
const app = express();
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
// TODO: add to config
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

app.use('*', (req, res, next) => {
  // Allow these root paths to pass through otherwise serve the app (index.html)
  if ((/^\/(sockjs-node|js|img)\//).test(req.originalUrl)) {
    next();
  } else {
    const filename = path.join(webpackCompiled.outputPath, 'index.html');
    webpackCompiled.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  }
});


if (isDeveloping) {
  app.use(require('webpack-dev-middleware')(webpackCompiled, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
  }));
  const server = new http.Server(app);
  server.listen(config.port, config.host, (err, res) => {
    if (err) {
      console.log(err);
    }
    winston.info('Development: listening on ' + config.host + ':' + config.port);
  });

} else {
  http.createServer(app).listen(config.port, config.host, (err, result) => {
    if (err) {
      console.log(err);
    }
    winston.info('Production: listening on ' + config.host + ':' + config.port);
  });
}

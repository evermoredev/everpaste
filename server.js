import winston from 'winston';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import path from 'path';
import limiter from 'connect-ratelimit';

import docHandler from './server/modules/doc_handler';

import config from './config';

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

// Load the configuration and set some defaults
config.port = process.env.PORT || config.port || 7777;
config.host = process.env.HOST || config.host || 'localhost';

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

const app = express();

app.use(express.static(__dirname + '/public'));

// for parsing application/json
// TODO: add to config
app.use(bodyParser.json({ limit: '50mb' }));
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limit all requests
if (config.rateLimits) {
  config.rateLimits.end = true;
  app.use(limiter(config.rateLimits));
}

/**
 * Set up some routing
 */

// api calls for the server to handle
app.post('/api', (req, res) => docHandler.handlePost(req, res));
app.get('/api/list', (req, res) => docHandler.handleGetList(req, res));
app.get('/api/:id', (req, res) => docHandler.handleGet(req.params.id, res));
app.get('/raw/:id', (req, res) => docHandler.handleRawGet(req.params.id, res));

// Catch-all to send to the webapp
app.get('*', (req, res, next) => {
  // If the route matches a static route we know about, pass it through
  // Otherwise, we'll pass the route to the react app
  if ((/^\/(js|img)\//).test(req.originalUrl)) {
    next();
  } else {
    // render the app
    res.sendFile(path.join(__dirname + '/public/index.html'));
  }
});

http.createServer(app).listen(config.port, config.host, (err, result) => {
  if (err) {
    console.log(err);
  }
  winston.info('listening on ' + config.host + ':' + config.port);
});

/**
 * This config file uses the base webpack config and makes some
 * modifications for use in production.
 */

const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

const webpackConfig = require('./webpack.config');

webpackConfig.entry = {
  app: [
    path.join(__dirname, '../../client/index.jsx')
  ]
};

// Add some optimizations to the plugins
webpackConfig.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.AggressiveMergingPlugin()
);

module.exports = webpackConfig;

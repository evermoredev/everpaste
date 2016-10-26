import webpack from 'webpack';
import winston from 'winston';
import webpackConfig from './webpack.config.js';

// Delete previous built files
const exec = require('child_process').exec;
const command = 'rm ./public/js/app.* && rm ./public/index.html';

exec(command, (error) => {
  if (error) {
    winston.info('No build files to remove:' + error);
  } else {
    winston.info('Successfully deleted old build files.');
  }
});

// Runs the webpack compiler and outputs to dist folder
const compiler = webpack(webpackConfig);

try {
  compiler.run((error, stats) => {
    let jsonStats = stats.toJson();

    if (error) {
      winston.info('Error has occured while compiling', error);
    }

    if (stats.hasErrors()) {
      winston.info(`Error while compiling:`, jsonStats.errors);
    }
    else if (stats.hasWarnings()) {
      winston.info(`Warnings while compiling:`, jsonStats.warnings);
    }
    else {
      winston.info('No warnings or errors while compiling');
      winston.info('Webpack build has successfully finished!');
    }
  })
}
catch (error) {
  winston.info('compiling has failed', error);
}

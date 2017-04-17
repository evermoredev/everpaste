import winston from 'winston';
import child_process from 'child_process';

const compile = (webpackPrepped) => {

  // This is relative to where you start the server
  const command = 'rm ./public/js/app.* && rm ./public/index.html';

  child_process.exec(command, (error) => {
    if (error) {
      winston.info('No build files to remove.');
    } else {
      winston.info('Successfully deleted old build files.');
    }
  });

  try {
    webpackPrepped.run((error, stats) => {
      let jsonStats = stats.toJson();

      if (error) {
        winston.info('Error has occured while compiling:', error);
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
    winston.info('Compiling has failed:', error);
  }

};

export default compile;

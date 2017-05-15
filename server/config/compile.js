import winston from 'winston';

const compile = (webpackPrepped) => {

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

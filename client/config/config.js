/**
 * This config data is read by most of the client modules.
 * Rename this file to config.js before running for the first time.
 *
 * DO NOT put sensitive data in this config. This config file is accessible
 * by the client. For sensitive information used by the server, use
 * /server/config/config.js
 */

const config = {

  /**
   * @headerTitle Text that will be displayed as the title of your application
   *   in the header. Not to be confused with the document title, which is set
   *   in the /server/config/config.js to be compiled with the index.ejs template
   * @logoUrl Path to the log in the header. To use a logo in the /public/img
   *   directory, change this line to '/img/filename.ext'
   */
  headerTitle: 'My Pastebin',
  logoUrl: '//avatars2.githubusercontent.com/u/19895371'

};

export default config;

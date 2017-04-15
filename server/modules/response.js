/**
 * Some helper functions for handling responses
 */

/**
 * Ends the response with failing messages
 * @param {object} res - the response object
 * @param {object} opts -
 *        @serverMsg {string} server logging
 *        @resCode {number} response code
 *        @clientMsg {string} message sent back to the client
 */
export const fail = (res, opts = {}) => {
  if (opts.serverMsg) winston.warn(opts.serverMsg);
  res.writeHead(opts.resCode || 404, contentType.json);
  res.end(JSON.stringify({ message: opts.clientMsg }));
};

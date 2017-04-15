/**
 * Constants and helpers for those constants to be used for the client and the
 * server.
 */

/**
 * Privacy options for the application
 */
export const privacyOptions = {
  public: 'public',
  private: 'private',
  encrypted: 'encrypted'
};

/**
 * Returns the privacy option if it exists, otherwise public
 * @param {string} option
 */
export const getPrivacyOption = (option) =>
  (Object.keys(privacyOptions).includes(option)) ?
    option : privacyOptions.public;

/**
 * Expiration options for the application
 */
export const expirationOptions =
  ['30 Minutes', '6 Hours', '1 Day', '1 Week', '1 Month', 'Forever'];

/**
 * Returns the expiration option if it exists, otherwise use the first option
 * @param {string} option
 */
export const getExpirationOption = (option) =>
  expirationOptions.includes(option) ? option : expirationOptions[0];

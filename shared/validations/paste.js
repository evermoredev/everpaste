import { expirationOptions, privacyOptions } from '../config/constants';

const maxFileSize = 50000000;
const maxTextLength = 50000000;
const minTextLength = 3;

export const fileValidation = (file) => {
  let errors = [];
  if (file.size > maxFileSize) {
    errors.push('File larger than 50mb file size limit.');
  }
  return {
    passed: !errors.length, errors
  };
};

/**
 * A validation module for posting pastes.
 * This allows consistency of validation for client and server.
 * @param {object} data
 * @returns {object}
 */
export const pasteValidation = (data) => {
  let errors = [];

  // Validations if a file upload exists
  if (data.file) {
    errors = errors.concat(fileValidation(data.file).errors);
  }
  else if (!data.text) {
    errors.push('Please provide text or a file.');
  }
  else if (data.text.length < 3) {
    errors.push(`Minimum text length is ${minTextLength} characters.`);
  }
  else if (data.text.length > maxTextLength) {
    errors.push('Exceeded maximum text length.');
  }

  if (!expirationOptions.includes(data.expiration)) {
    errors.push('Please select a valid expiration option.');
  }
  if (!Object.keys(privacyOptions).includes(data.privacy)) {
    errors.push('Please select a valid privacy option.');
  }

  return {
    passed: !errors.length, errors
  };
};

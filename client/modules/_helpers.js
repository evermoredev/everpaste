/**
 * Escapes a string for html display
 * @param {string} str
 */
export const htmlEscapeStr = str => {
  return str.replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
};

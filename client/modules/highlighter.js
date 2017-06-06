/**
 * Uses highlight.js for syntax highlighting. Adds line numbers and
 * wraps in columns to avoid the terrible horizontal scrolling that most
 * html views use when displaying code.
 *
 * Options include:
 *   rowClassName: additional classNames for each table row
 *   hideTableWrapper: leave the <table></table> tags off
 *   hideLineNumbers: leaves the show-line-number class off
 */
import hljs from 'highlight.js';
import { htmlEscapeStr } from './_helpers';

const highlight = (code, options = {}) => {
  const { lang } = options;
  options.rowClassName = options.rowClassName || '';

  let codeBuf;

  // HighlightJS throws an error if the language you're trying doesn't exist.
  try {
    if (lang === 'txt') {
      codeBuf = htmlEscapeStr(code);
    } else if (lang) {
      codeBuf = hljs.highlight(code, lang).value;
    } else {
      codeBuf = hljs.highlightAuto(code).value;
    }
  } catch (e) {
    codeBuf = hljs.highlightAuto(code).value;
  }

  codeBuf =
    codeBuf.replace(/^\s+/, (emptyStr) => emptyStr.replace(/\s/g, '&nbsp;'));

  if (options.removeTrailingNewLine) {
    codeBuf = codeBuf.replace(/(\n|\r\n)$/, '');
  }

  // create the classname for each row
  let rowClassName = 'code-row';
  if (!options.hideLineNumbers) {
    rowClassName += ' show-line-number';
  }
  if (options.rowClassName) {
    rowClassName += ` ${options.rowClassName}`;
  }

  // Add Line Numbers and wrap in a table
  let buf = '';
  if (!options.hideTableWrapper) {
    buf = '<table class="code-table hljs">';
  }

  codeBuf.split('\n').forEach((str) => {
    buf += `<tr class="${rowClassName}">`;
    buf += `<td class="line-number"></td><td class="code-col">${str}</td></tr>`;
  });

  if (!options.hideTableWrapper) {
    buf += '</table>';
  }

  return buf;
};

export default highlight;

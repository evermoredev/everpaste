/**
 * Uses highlight.js for syntax highlighting. Adds line numbers and
 * wraps in columns to avoid the terrible horizontal scrolling that most
 * html views use when displaying code.
 *
 */
import hljs from 'highlight.js';
import { htmlEscapeStr } from './_helpers';

const highlight = (code, options = {}) => {
  const { lang } = options;
  let codeBuf;

  // HighlightJS throws an error if the language you're trying doesn't exist.
  try {
    if (lang == 'txt') {
      codeBuf = htmlEscapeStr(code);
    } else if (lang) {
      codeBuf = hljs.highlight(code, lang).value;
    } else {
      codeBuf = hljs.highlightAuto(code).value;
    }
  } catch (e) {
    codeBuf = hljs.highlightAuto(code).value;
  }

  // Add Line Numbers and wrap in a table
  codeBuf =
    codeBuf.replace(/^\s+/, (emptyStr) => emptyStr.replace(/\s/g, '&nbsp;'));
  let buf = '<table class="code-table hljs">';
  codeBuf.split('\n').forEach((s, i) => {
    buf += `<tr class="code-row"><td class="line-number"></td><td class="code-col">${s}</td></tr>`;
  });
  buf += '</table>';

  return buf;
};

export default highlight;

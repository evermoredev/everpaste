import { diffLines } from 'diff';

import highlighter from './highlighter';

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

export const getHighlightedDiffText = (oldText, newText, highlightLang) => {
  const oText = (oldText || '').replace(/\r\n/g, '\n'),
    nText = (newText || '').replace(/\r\n/g, '\n');
  const diff = diffLines(oText, nText, { newlineIsToken: true });

  return diff.map((part, idx) => {
    const spanClass = (part.added) ? 'added' : (part.removed) ? 'removed' : '';

    return highlighter(part.value, {
      lang: highlightLang,
      hideLineNumbers: true,
      rowClassName: spanClass,
      hideTableWrapper: true,
      removeTrailingNewLine: (spanClass === 'added' || spanClass === 'removed')
    });
  }).join('');
};

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
  oldText = (oldText || '').replace(/\r\n/g,'\n');
  newText = (newText || '').replace(/\r\n/g,'\n');
  const diff = diffLines(oldText, newText, { newlineIsToken: true });

  return diff.map((part, idx) => {
    const spanClass = (part.added) ? 'added' : (part.removed) ? 'removed' : '';

    return highlighter(part.value, {
      lang: highlightLang,
      hideLineNumbers: true,
      rowClassName: spanClass,
      hideTableWrapper: true,
      removeTrailingNewLine: (spanClass == 'added' || spanClass == 'removed')
    });
  }).join('');
};

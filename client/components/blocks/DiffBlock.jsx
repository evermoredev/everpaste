import { diffLines } from 'diff';
import React from 'react';

/**
 * This block is used primarily to show a diff in the PasteView when editing
 * on a forked paste.
 */
class DiffBlock extends React.Component {

  static replaceNewlines(text) {
    return text.replace(/\r\n/g, '\n');
  }

  constructor(props) {
    super(props);
  }

  /**
   * Renders the diff between text from an edit and the current text
   */
  renderDiff = () => {
    // Make sure line endings are the same so they don't show up in diff
    const oldText = DiffBlock.replaceNewlines(this.props.oldText || ''),
      newText = DiffBlock.replaceNewlines(this.props.newText || ''),
      diff = diffLines(oldText, newText, { newlineIsToken: true });

    return diff.map((part, idx) => {
      const spanClass =
        (part.added) ? 'added' : (part.removed) ? 'removed' : '';
      return (
        <pre key={idx} className={spanClass}>
          {part.value}
        </pre>
      );
    });
  };

  render() {
    return (
      <div className="diff-block">
        {this.renderDiff()}
      </div>
    );
  }

}

DiffBlock.displayName = 'DiffBlock';

export default DiffBlock;

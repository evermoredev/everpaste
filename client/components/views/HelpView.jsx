import marked from 'marked';
import PropTypes from 'prop-types';
import React from 'react';

import { HeaderBlock } from '../blocks';
import { doRequest } from '../../modules/request';

/**
 * View for displaying help. Currently pulls in the changelog from the github
 * repo.
 */
class HelpView extends React.Component {

  constructor(props) {
    super(props);

    // Initially set text to empty until it's loaded from github
    this.state = {
      text: ''
    }
  }

  /**
   * Make the xhr request to the github page and setState with the content rec'd
   */
  componentWillMount() {
    doRequest({
      url: `https://raw.githubusercontent.com/evermoredev/everpaste/master/CHANGELOG.md`
    })
    .then(data => {
      this.setState({ text: data })
    })
    .catch(error => {
      this.setState({ text: 'Problem loading help from github.'})
    });
  }

  render() {
    return (
      <div className={
        `help-view flex-container ${this.context.styleStore.theme.className}`
      }>
        <HeaderBlock
          disabled={{ raw: true, edit: true, save: true }}
        />
        <div className="view-container">
          <div>
            Please submit bug reports or feature requests to:
            <a href="https://github.com/evermoredev/everpaste/issues">
              EverPaste Repo
            </a>
          </div>
          <div
            className="code-document"
            dangerouslySetInnerHTML={{__html: marked(this.state.text) }}
          >
          </div>
        </div>
      </div>
    );
  }

}

HelpView.contextTypes = {
  styleStore: PropTypes.object
};

export default HelpView;

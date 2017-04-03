import React from 'react';
import marked from 'marked';
import { doRequest } from '../../modules/request';
import { HeaderBlock } from '../blocks';

class HelpView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }
  }

  componentWillMount() {
      doRequest({ url: `https://raw.githubusercontent.com/evermoredev/everpaste/master/CHANGELOG.md` })
      .then(data => {
        this.setState({ text: data })
      })
      .catch(error => {
        this.setState({ text: 'Problem loading help from github.'})
      });
  }

  render() {
    return (
      <div className={`help-view flex-container ${this.context.styleStore.theme}`}>
        <HeaderBlock
          disabled={{ raw: true, edit: true, save: true }}
        />
        <div className="view-container">
          <div>
            Please submit bug reports or feature requests to: <a href="https://github.com/evermoredev/everpaste/issues">EverPaste Repo</a>
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
  styleStore: React.PropTypes.object
};

export default HelpView;

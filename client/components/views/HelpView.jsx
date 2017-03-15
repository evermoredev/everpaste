import React from 'react';
import axios from 'axios';
import marked from 'marked';
import { HeaderBlock } from '../blocks';

class HelpView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }
  }

  componentWillMount() {
      axios(`https://raw.githubusercontent.com/evermoredev/everpaste/master/CHANGELOG.md`)
      .then(res => {
        this.setState({ text: res.data })
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
        <div className="view-container" style={{ paddingLeft: 30, color: 'white' }}>
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

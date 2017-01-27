import React from 'react';
import axios from 'axios';
import marked from 'marked';

class HelpView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }
  }

  componentWillMount() {
    axios
      .get(`https://raw.githubusercontent.com/evermoredev/everpaste/master/CHANGELOG.md`)
      .then(res => {
        this.setState({ text: res.data })
      })
      .catch(error => {
        this.setState({ text: 'Problem loading help from github.'})
      });
  }

  render() {
    return (
      <div className="help-view">
        <div className="code-container hljs" style={{ paddingLeft: 30 }}>
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

export default HelpView;

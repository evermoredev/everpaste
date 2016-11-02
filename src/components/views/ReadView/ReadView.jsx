import React from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';

import { HeaderLayout } from 'components/layouts';

@observer(['GlobalStore', 'ViewsStore', 'StyleStore'])
class ReadView extends React.Component {

  constructor(props) {
    super(props);

    this.props.GlobalStore.currentView = 'ReadView';

    this.state = {
      title: '',
      text: '',
      name: '',
      docKey: '',
      loaded: false
    };
  }

  componentDidMount() {
    this.getDoc(this.props.params.key);
  }

  getDoc = (key) => {
    axios
      .get(`/api/${key}`)
      .then(res => {
        // Clone the old state so that we only setState once
        const newState =
          Object.assign({}, this.state, res.data);
        this.setState(newState);
        // Store the text that get's loaded in case they click edit.
        this.props.ViewsStore.readViewText = res.data.rawText;
        this.props.GlobalStore.readViewDocKey = key;
      })
      .catch(error => {
        console.log(error);
      });
  };

  renderCodeBlock = () => {
    if (this.state.text) {
      return (
        <pre>
          <code dangerouslySetInnerHTML={{ __html: this.state.text }} />
        </pre>
      )
    } else {
      return (
        <div className="loader">
          <span>{`{`}</span>
          <span>{`}`}</span>
        </div>
      )
    }
  };

  render() {
    console.log('this.state', this.state);
    return (
      <div className="code-container hljs">
        <HeaderLayout docKey={this.state.docKey} />
        <div className="error-messages"></div>
        <div className="code-information-container">
          <div className="unselectable code-title">
          {this.state.title || 'Untitled'}
          {this.state.name &&
            <span className="from-name">from {this.state.name}</span>
          }
          </div>
        </div>
        <div className="code-document">
          {this.renderCodeBlock()}
        </div>
      </div>
    );
  }

}

export default ReadView;

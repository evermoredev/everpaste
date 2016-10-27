import React from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';

import HeaderLayout from 'components/layouts/HeaderLayout';

@observer
class PasteView extends React.Component {

  constructor(props) {
    super(props);

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
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="main-container">
        <HeaderLayout docKey={this.state.key} />
        <div id="messages"></div>
        <div className="unselectable code-title">
          {this.state.title || 'Untitled'}
          {this.state.name &&
            <span className="from-name">from {this.state.name}</span>
          }
        </div>
        <div id="code-document">
          <pre>
            <code dangerouslySetInnerHTML={{ __html: this.state.text }} />
          </pre>
        </div>
      </div>
    );
  }

}

export default PasteView;

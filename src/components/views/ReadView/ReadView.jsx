import React from 'react';
import { observer } from 'mobx-react';
import ReadViewStore from './ReadViewStore';

@observer(['AppStore', 'ViewsStore', 'StyleStore'])
class ReadView extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.store = new ReadViewStore(this.props);
    this.store.getDoc(this.props.params.key);
  }

  componentWillReceiveProps(nextProps) {
    this.store = new ReadViewStore(nextProps);
  }

  renderCodeBlock = () => {
    if (this.store.text) {
      return (
        <pre>
          <code dangerouslySetInnerHTML={{ __html: this.store.text }} />
        </pre>
      )
    } else {
      return (
        <div className="loader hljs">
          <span>&#123;</span>
          <span>&#125;</span>
        </div>
      )
    }
  };

  render() {
    return (
      <div className="code-container hljs">
        <div className="error-messages"></div>
        <div className="code-information-container">
          <div className="unselectable code-title">
          {this.store.title || 'Untitled'}
          {this.store.name &&
            <span className="from-name">from {this.store.name}</span>
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

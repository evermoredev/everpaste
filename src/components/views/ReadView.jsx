import React from 'react';
import axios from 'axios';
import { HeaderBlock } from '../blocks';
import { privacyOptions } from '../../config/constants';

class ReadView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      text: '',
      name: '',
      docKey: '',
      privacyOption: '',
      secretKey: ''
    }
  }

  componentWillMount() {
    this.getDoc(this.props.match.params.docKey);
  }

  getDoc = (docKey) => {
    axios
      .get(`/api/${docKey}`)
      .then(res => {
        this.setState({
          title: res.data.title,
          text: res.data.text,
          rawText: res.data.rawText,
          name: res.data.name,
          docKey: res.data.key,
          privacyOption: res.data.privacyoption
        });
        this.context.currentPaste = this.state;
      })
      .catch(error => {
        window.location = '/404';
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
        <div className="loader hljs">
          <span>&#123;</span>
          <span>&#125;</span>
        </div>
      )
    }
  };

  rawButton = () =>
    window.open(`/raw/${this.state.docKey}`, '_blank');

  render() {
    return (
      <div className={`read-view flex-container ${this.context.styleStore.theme}`}>
        <HeaderBlock
          rawButton={this.rawButton}
          currentPaste={this.state}
          disabled={{ }}
        />
        {this.state.privacyOption == privacyOptions.encrypted ?
            <div className="view-container">
              <h3 className="white-text">
                This document is encrypted. Please enter Secret Key below.
              </h3>
              <form className="pure-form">
                <fieldset>
                    <div>
                      <label htmlFor="secretKey">
                        <input
                          style={{ marginLeft: '10px' }}
                          className="input-dark"
                          type="text"
                          name="name"
                          value={this.state.secretKey}
                          placeholder="Secret Key"
                          onChange={this.handleChange}
                        />
                      </label>
                    </div>
                </fieldset>
              </form>
            </div>
          :
            <div className="view-container hljs">
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
        }
      </div>
    );
  }

}

ReadView.contextTypes = {
  styleStore: React.PropTypes.object
};

export default ReadView;

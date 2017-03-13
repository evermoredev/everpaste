import React from 'react';
import axios from 'axios';
import { HeaderBlock } from '../blocks';
import { privacyOptions } from '../../config/constants';
import CryptoJS from 'crypto-js';
import highlighter from '../../modules/highlighter';
import Condition from '../../modules/components/Condition';

class ReadView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      text: '',
      name: '',
      docKey: '',
      lang: '',
      privacyOption: '',
      secretKey: '',

      rawDisabled: true,
      editDisabled: true,
      error: ''
    }
  }

  componentWillMount() {
    const { docKey, lang } = this.splitDocKey(this.props.match.params.docKey);
    this.getDoc(docKey, lang);
  }

  splitDocKey = docKey => {
    const docParts = docKey.split('.', 2);
    return {
      docKey: docParts[0], lang: docParts[1]
    }
  };

  getDoc = (docKey, lang) => {
    axios
      .get(`/api/${docKey}`)
      .then(res => {
        console.log('state,',this.state);
        let { title, text, name, docKey } = res.data,
            privacyOption = res.data.privacyoption,
            { rawDisabled, editDisabled } = this.state;

        // Set some things up based on whether or not this text is encrypted
        // Like only highlighting text if it's not encrypted
        if (privacyOption != privacyOptions.encrypted) {
          text = highlighter(text);
          rawDisabled = true;
          editDisabled = true;
        }
        this.setState({
          title, text, name, docKey, privacyOption, lang, rawDisabled, editDisabled
        });
        console.log('state,',this.state);

        this.context.currentPaste = this.state;
      })
      .catch(error => {
        console.log(error);
        window.location = '/404';
      });
  };

  handleSecretKeySubmit = (e) => {
    e.preventDefault();
    const decryptedText =
      CryptoJS.AES.decrypt(this.state.text, this.state.secretKey)
        .toString(CryptoJS.enc.Utf8);

    // if decryptedText is empty, the key was wrong
    if (!decryptedText) {
      this.setState({
        error: 'The secret key is incorrect.'
      });
    } else {
      this.setState({
        privacyOption: privacyOptions.private,
        text: highlighter(decryptedText, this.state.lang),
        secretKey: '',
        rawDisabled: false,
        editDisabled: false,
      });
    }
  };

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

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
          disabled={{
            raw: this.state.rawDisabled,
            edit: this.state.editDisabled
          }}
        />

        <Condition
          condition={this.state.privacyOption == privacyOptions.encrypted}
          className="view-container" style={{ margin: '0 auto' }}>
          <h3 style={{ width: '100%', color: 'white' }}>
            This document is encrypted. Please enter Secret Key below.
            <Condition condition={this.state.error} style={{ color: 'red' }}>
              {this.state.error}
            </Condition>
          </h3>
          <form className="pure-form" onSubmit={this.handleSecretKeySubmit} >
            <fieldset>
                <div>
                  <label htmlFor="secretKey">
                    <input
                      style={{ marginLeft: '10px' }}
                      className="input-dark"
                      type="text"
                      name="secretKey"
                      value={this.state.secretKey}
                      placeholder="Secret Key"
                      onChange={this.handleChange}
                    />
                  </label>
                </div>
            </fieldset>
          </form>
        </Condition>

        <Condition
          condition={this.state.privacyOption != privacyOptions.encrypted}
          className="view-container hljs">
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
        </Condition>
      </div>
    );
  }

}

ReadView.contextTypes = {
  styleStore: React.PropTypes.object
};

export default ReadView;

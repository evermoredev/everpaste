import React from 'react';
import { HeaderBlock } from '../blocks';
import { privacyOptions } from '../../../shared/config/constants';
import CryptoJS from 'crypto-js';
import highlighter from '../../modules/highlighter';
import { doRequest } from '../../modules/request';
import { Condition } from '../../modules/components';
import { Redirect } from 'react-router-dom';

/**
 * View for displaying the result of a paste
 */
class ReadView extends React.Component {

  /**
   * @param {string} docKey - Splits a docKey that may have a language extension
   * @returns {object}
   */
  static splitDocKey = docKey => {
    const docParts = docKey.split('.', 2);
    return {
      docKey: docParts[0], lang: docParts[1]
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      text: '',
      rawText: '',
      name: '',
      docKey: '',
      lang: '',
      privacy: '',
      secretKey: '',
      filename: '',

      rawDisabled: true,
      editDisabled: true,
      error: '',

      redirect: null
    }
  }

  componentWillMount() {
    // The request may come in with a language extenstion
    const { docKey, lang } =
      ReadView.splitDocKey(this.props.match.params.docKey);
    this.getDoc(docKey, lang);
  }


  getDoc = (docKey, lang) => {
    doRequest({ url: `/api/${docKey}`})
      .then((data) => {
        let { title, text, name, privacy, filename } = data,
            { rawDisabled, editDisabled } = this.state,
            rawText;

        // Set some things up based on whether or not this text is encrypted
        // Like only highlighting text if it's not encrypted
        if (privacy != privacyOptions.encrypted) {
          rawText = text;
          text = highlighter(text, { lang });
          rawDisabled = false;
          editDisabled = false;
        }
        this.setState({
          title, text, rawText, name, docKey,
          privacy, lang, rawDisabled, editDisabled,
          filename: filename
        });
        this.context.currentPaste = this.state;
      })
      .catch((error) => {
        this.setState({ redirect: { pathname: '/404' } });
      });
  };

  handleSecretKeySubmit = (e) => {
    e.preventDefault();
    let decryptedText;

    try {
      let bstring = atob(this.state.secretKey);
      decryptedText = CryptoJS.AES.decrypt(this.state.text, bstring)
        .toString(CryptoJS.enc.Utf8);
    } catch(e) {
      this.setState({ error: 'The secret key is incorrect.' });
      return;
    }

    // if decryptedText is empty, the key was wrong
    if (!decryptedText) {
      this.setState({ error: 'The secret key is incorrect.' });
    } else {
      this.setState({
        privacy: privacyOptions.private,
        rawText: decryptedText,
        text: highlighter(decryptedText, { lang: this.state.lang }),
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

  rawButton = () => {
    const win = window.open("", '_blank');
    win.document.body.innerHTML = '<pre>' + this.state.rawText + '</pre>';
  };

  render() {
    // All the redirects here are for 404s. Replace the current route instead of
    // pushing.
    if (this.state.redirect)
      return <Redirect to={this.state.redirect} push={false} />;

    const showFile = !!this.state.filename,
          showSecretForm = this.state.privacy == privacyOptions.encrypted && !showFile,
          showText = this.state.privacy != privacyOptions.encrypted && !showFile,
          isImage = showFile && this.state.filename.match(/\.(jpeg|jpg|gif|png)$/i);

    return (
      <div
        className={
          `read-view flex-container ${this.context.styleStore.theme.className}`
        }
      >
        <HeaderBlock
          rawButton={this.rawButton}
          currentPaste={this.state}
          disabled={{
            raw: this.state.rawDisabled,
            edit: this.state.editDisabled
          }}
        />

        {/*
          There's a lot of logic here for which part of ReadView should be displayed.
          Eventually, this should be broken in to smaller components.

          This block is for text views that are not related to file uploads
        */}
          <Condition condition={showSecretForm}>
            <div
              className="view-container"
              style={{ margin: '0 auto', textAlign: 'center' }}>
              <h3 style={{ width: '100%', color: 'white' }}>
                This document is encrypted. Please enter Secret Key below.
              </h3>
              <form
                className="pure-form"
                style={{ textAlign: 'center' }}
                onSubmit={this.handleSecretKeySubmit} >
                <fieldset>
                    <div>
                      <label htmlFor="secretKey">
                        <input
                          style={{ marginLeft: '10px' }}
                          className="input-dark"
                          type="password"
                          name="secretKey"
                          value={this.state.secretKey}
                          placeholder="Secret Key"
                          onChange={this.handleChange}
                        />
                      </label>
                    </div>
                </fieldset>
              </form>
              <Condition value={this.state.error} style={{ color: 'red' }} />
            </div>
          </Condition>

          <Condition condition={!showSecretForm}>
            <div className="view-container hljs">
              <Condition value={this.state.error} style={{ color: 'red' }} />
              <div className="code-information-container">
                <div className="unselectable code-title">
                  <Condition value={this.state.title} default="Untitled" />
                  <Condition condition={this.state.name}>
                    <span className="from-name">from {this.state.name}</span>
                  </Condition>
                </div>
              </div>

              <Condition condition={showText}>
                <div className="code-document">
                  {this.renderCodeBlock()}
                </div>
              </Condition>

              <Condition condition={showFile}>
                <div className="view-container text-center file-download">
                  <Condition condition={isImage}>
                    <a href={`/api/file/${this.state.docKey}`} target="_blank">
                      <img src={`/api/file/${this.state.docKey}`} />
                    </a>
                  </Condition>
                  <Condition condition={!isImage}>
                    <a href={`/api/file/${this.state.docKey}`}>
                      {this.state.filename}
                    </a>
                  </Condition>
                </div>
              </Condition>
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

import CryptoJS from 'crypto-js';
import * as CSV from 'csv-string';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';

import { HeaderBlock, LoaderBlock } from '../blocks';
import { privacyOptions } from '../../../shared/config/constants';
import { getHighlightedDiffText } from '../../modules/_helpers';
import highlighter from '../../modules/highlighter';
import { doRequest } from '../../modules/request';
import { Condition } from '../../modules/components';

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
    };
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
      forkedKey: '',
      forkedText: '',
      diffText: '',

      rawDisabled: true,
      editDisabled: true,
      error: '',
      renderMode: this.props.match.params.renderMode,

      redirect: null
    };

    this.initialState = this.state;
  }

  componentWillMount() {
    // The request may come in with a language extenstion
    const { docKey, lang } =
      ReadView.splitDocKey(this.props.match.params.docKey);
    this.getDoc(docKey, lang);
  }

  /**
   * Reload the component if the url has changed after the component has already
   * mounted, or if we receive a 'reload: true' prop from the router.
   *
   * This fixes back button issues when only the url changes, but not the
   * component.
   */
  componentWillReceiveProps(nextProps, nextContext) {
    const reloadComponent = (
      (nextProps.location.state && nextProps.location.state.reload) ||
      (this.props.match.url != nextProps.match.url)
    );
    if (reloadComponent) {
      this.setState(this.initialState, () => {
        this.componentWillMount();
      });
      return;
    }
    const resetView = this.props.match.params.renderMode !== 
      nextProps.match.params.renderMode;
    if (resetView) {
      this.loadRenderMode(nextProps.match.params.renderMode);
    }
  }

  getDoc = (docKey, lang) => {
    doRequest({ url: `/api/${docKey}`})
      .then((data) => {
        let { title, text, name, privacy, filename, forkedKey, forkedText } = data,
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
          title, text, rawText, name, docKey, forkedKey, forkedText,
          privacy, lang, rawDisabled, editDisabled, filename
        });
        this.context.currentPaste = this.state;
        this.loadRenderMode(this.props.match.params.renderMode);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ redirect: { pathname: '/404' } });
      });
  };

  handleSecretKeySubmit = (event) => {
    event.preventDefault();
    let decryptedText;

    try {
      const bstring = atob(this.state.secretKey);
      decryptedText = CryptoJS.AES.decrypt(this.state.text, bstring)
        .toString(CryptoJS.enc.Utf8);
    } catch(err) {
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
        editDisabled: false
      });
    }
  };

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  loadRenderMode = (mode) => {
    this.setState({ renderMode: mode });
    switch (mode) {
      case "diff":
        this.loadDiff();
        break;
      case "plantuml":
        this.loadPlantUml(this.state.docKey);
        break;
      case "csv":
      default:
        this.setState({ renderMode: mode });
        break;
    }
  };

  loadDiff = () => {
    this.setState({
      diffText: getHighlightedDiffText(
        this.state.forkedText,
        this.state.rawText,
        this.state.lang
      ),
    });
  };

  loadPlantUml = (docKey) => {
    doRequest({ url: `/api/${docKey}/plantuml` })
      .then((data) => {
        this.setState({ plantUml: data });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error: "Unable to process text as PlantUML." });
      });
  };

  selectRenderMode = (mode) => {
    if (this.props.match.params.renderMode === mode) {
      this.props.history.push(`/${this.state.docKey}`);
    } else {
      this.props.history.push(`/${this.state.docKey}/${mode}`);
    }
  };

  renderCodeBlock = () => {
    if (this.state.text) {
      return (
        <pre>
          <code dangerouslySetInnerHTML={{ __html: this.state.text }} />
        </pre>
      );
    }

    return (<LoaderBlock />);
  };

  renderCSV = () => {
    if (this.state.rawText) {
      const text = this.state.rawText.split('\n').filter((content) => !!content);
      let maxRowLength = 0;
      const rows = text.map((trow) => {
        const row = CSV.parse(trow)[0];
        if (row.length > maxRowLength) {
          maxRowLength = row.length;
        }
        return row;
      });

      return (
        <div className="w-100 flex-center">
          <table className="hljs csv-table">
            <tbody>
              {rows.map((row, idx) => {
                if (row.length < maxRowLength) {
                  row = row.concat(Array(maxRowLength - row.length).fill(''));
                }
                return (
                  <tr key={idx}>
                    {row.map((t, idx2) => {
                      return (
                        <td key={idx2}>
                          {t.trim()}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
  };

  renderDiffBlock = () => {
    if (this.state.diffText) {
      return (
        <pre>
          <code>
            <table
              className="code-table hljs"
              dangerouslySetInnerHTML={{ __html: this.state.diffText }}
            />
          </code>
        </pre>
      );
    }

    return (<LoaderBlock />);
  };

  renderPlantUml = () => {
    if (this.state.plantUml) {
      return (
        <div className="w-100 flex-center">
          <div
            className="p-10 bg-white flex-center"
            dangerouslySetInnerHTML={{ __html: this.state.plantUml }}
          />
        </div>
      );
    }
    return (<LoaderBlock />);
  }

  rawButton = () => {
    const win = window.open("", '_blank');
    win.document.body.innerHTML = `<pre>${this.state.rawText}</pre>`;
  };

  render() {
    // All the redirects here are for 404s. Replace the current route instead of
    // pushing.
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} push={false} />;
    }

    const showFile = !!this.state.filename,
      showSecretForm =
        this.state.privacy === privacyOptions.encrypted && !showFile,
      showText = this.state.privacy !== privacyOptions.encrypted && !showFile,
      isImage = showFile && this.state.filename.match(/\.(jpeg|jpg|gif|png)$/i);

    return (
      <div
        className={
          `view ${this.context.styleStore.theme.className}`
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
          There's a lot of logic here for how ReadView should be displayed.
          Eventually, this should be broken in to smaller components.

          This block is for text views that are not related to file uploads
        */}
        <Condition condition={showSecretForm}>
          <div className="view-container margin-auto text-center">
            <h3 className="white-text">
              This document is encrypted. Please enter Secret Key below.
            </h3>
            <form
              className=""
              onSubmit={this.handleSecretKeySubmit}
            >
              <input
                className="p-10"
                type="password"
                name="secretKey"
                value={this.state.secretKey}
                placeholder="Secret Key"
                onChange={this.handleChange}
              />
            </form>
            <Condition value={this.state.error} className="red-text" />
          </div>
        </Condition>

        <Condition condition={!showSecretForm}>
          <div className="view-container hljs">
            <Condition value={this.state.error} className="red-text" />

            <div className="unselectable text-center">
              <h3 className="m-10">
                <Condition
                  className="hljs-keyword"
                  value={this.state.title}
                  default="Untitled"
                />
                <Condition condition={this.state.name}>
                  <span className="italic">&nbsp;from {this.state.name}</span>
                </Condition>
                <span
                  className="ml-10 c-pointer"
                  style={{ fontSize: 12 }}
                  onClick={() => this.selectRenderMode('csv')}
                >
                  <i className="fa fa-table" />
                </span>
              </h3>
            </div>

            <Condition condition={showText && this.state.forkedKey}>
              <div className="fork-info">
                Forked from&nbsp;
                <Link to={{
                  pathname: `/${this.state.forkedKey}`,
                  state: { reload: true } }}
                >
                  {this.state.forkedKey}
                </Link>
                <span className="white-text">
                  &nbsp;|&nbsp;
                </span>
                <Condition condition={this.state.renderMode !== 'diff'}>
                  <span
                    className="c-pointer"
                    onClick={() => this.selectRenderMode('diff')}
                  >
                    Show diff
                  </span>
                </Condition>
                <Condition condition={this.state.renderMode === 'diff'}>
                  <span className="c-pointer"
                    onClick={() => this.selectRenderMode('')}
                  >
                    Hide diff
                  </span>
                </Condition>
              </div>
            </Condition>

            <Condition condition={!this.state.renderMode}>
              <div className="code-document">
                {this.renderCodeBlock()}
              </div>
            </Condition>

            <Condition condition={this.state.renderMode === 'csv'}>
              <div className="code-document">
                {this.renderCSV()}
              </div>
            </Condition>

            <Condition condition={this.state.renderMode === 'diff'}>
              <div className="code-document">
                {this.renderDiffBlock()}
              </div>
            </Condition>

            <Condition condition={this.state.renderMode === 'plantuml'}>
              <div className="code-document">
                {this.renderPlantUml()}
              </div>
            </Condition>

            <Condition condition={showFile}>
              <div className="view-container text-center file-download">
                <Condition condition={isImage}>
                  <a
                    href={`/api/file/${this.state.docKey}/${this.state.filename}`}
                    target="_blank"
                  >
                    <img src={`/api/file/${this.state.docKey}/${this.state.filename}`} />
                  </a>
                </Condition>
                <Condition condition={!isImage}>
                  <a href={`/api/file/${this.state.docKey}/${this.state.filename}`}>
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
  styleStore: PropTypes.object
};

export default withRouter(ReadView);

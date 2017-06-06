import CryptoJS from 'crypto-js';
import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import { Redirect, Link } from 'react-router-dom';

import { DiffBlock, HeaderBlock } from '../blocks';
import { Condition } from '../../modules/components';
import { setCookies, getCookie } from '../../modules/cookies';
import { doRequest } from '../../modules/request';
import {
  expirationOptions,
  getExpirationOption,
  privacyOptions,
  getPrivacyOption } from '../../../shared/config/constants';
import {
  fileValidation,
  pasteValidation } from '../../../shared/validations/paste';

/**
 * View for submitting a paste
 * This has become rather large after adding file uploading. Should probably
 * be split into sub-components soon.
 */
class PasteView extends React.Component {

  static tabOptions = {
    text: 1,
    upload: 2,
    diff: 3
  };

  constructor(props) {
    super(props);

    // Set some defaults
    this.initialState = {
      title: '',
      name: getCookie('name') || '',
      text: '',
      file: null,
      expiration: getExpirationOption(getCookie('expiration')),
      privacy: getPrivacyOption(getCookie('privacy')),
      errors: '',
      redirect: null,
      tabOption: PasteView.tabOptions.text
    };

    this.state = Object.assign({}, this.initialState);

    // If we're coming from an edit, grab the currentPaste data
    if (this.props.location.state && this.props.location.state.currentPaste) {
      // These items don't need to be on state. Saved to we can reference,
      // like diffing current text vs forked text
      this.state.rawTxtFromEdit =
        this.props.location.state.currentPaste.rawText || '';
      this.state.titleFromEdit =
        this.props.location.state.currentPaste.title || '';
      this.state.docKeyFromEdit = this.props.location.state.currentPaste.docKey;
      this.state.fromEdit = true;

      this.state.text = this.state.rawTxtFromEdit;
      this.state.title = this.state.titleFromEdit;
    }


  }

  /**
   * Reset the state if the router told us to reload
   * (The user clicked the + button again)
   */
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.location.state && nextProps.location.state.reload) {
      this.state = Object.assign({}, this.initialState);
      this.setState(this.state);
    }
  }

  /****************************** Event Handlers ******************************/

  /**
   * Determines if the paste has enough text to be saved
   */
  hasText = () => (this.state.text && this.state.text.length >= 3);

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  handlePrivacyRadio = (event) =>
    this.setState({ privacy: event.currentTarget.value });

  /**
   * Currently handles tab events so tabbing in a text area works
   * @param event
   */
  handleKeyDown = (event) => {
    if (event.keyCode === 9) {
      event.preventDefault();
      const val = this.state.text,
        start = event.target.selectionStart,
        end = event.target.selectionEnd;

      this.setState({ text: val.substring(0, start) + '\t' + val.substring(end) },
        () => this.textArea.selectionStart = this.textArea.selectionEnd = start + 1);
    }
  };

  /**
   * Handle dropping of a file to the Dropzone
   * @param {object} file
   */
  onDrop = (file) => {
    // If array, grab the first file only
    file = file[0] || file;
    console.log(file);
    const validate = fileValidation(file);
    if (validate.passed) {
      // Don't re-render, save one file
      this.state.file = file;
      // In case we got here with privacy set as encryption
      if (this.state.privacy === privacyOptions.encrypted) {
        this.state.privacy = privacyOptions.private;
      }
      // Invoke saving automatically
      this.saveButton();
    } else {
      this.setState({ errors: validate.errors });
    }
  };

  /**
   * Handle pasting of an image
   * @param {object} event
   */
  onPaste = (event) => {
    try {
      const items = event.clipboardData.items;

      for (let idx in items) {
        const item = items[idx];
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          const file = new File([blob], 'file', { type: blob.type });
          this.onDrop(file);
        }
      }
    } catch(err) {
      // Ignore errors from older browsers
    }
  };

  /**
   * Performs the save action for the paste
   */
  saveButton = () => {
    // Extract only the data we need for saving from state.
    // TODO: is there a one liner to assign only certain properties from
    //       one object to another? Would like this to be 1 statement.
    const { name, title, text, expiration, privacy, file } = this.state;
    const saveData = { name, title, text, expiration, privacy, file };

    const validate = pasteValidation(saveData);

    if (!validate.passed) {
      this.setState({ errors: validate.errors });
      return;
    }

    // Handle encryption
    let secretKey;
    if (this.state.privacy === privacyOptions.encrypted) {
      const arr = new Uint8Array(1024);
      // User the non armored key for encryption
      const encryptKey =
        String.fromCharCode(...window.crypto.getRandomValues(arr));
      // Create the user friendly/armored key for display
      secretKey = btoa(encryptKey);
      // Encrypt the text to be sent to the server
      saveData.text =
        CryptoJS.AES.encrypt(saveData.text, encryptKey).toString();
    }

    // Add the forkedKey
    if (this.state.docKeyFromEdit) {
      saveData.forkedKey = this.state.docKeyFromEdit;
    }

    // Make the request
    doRequest({
      method: 'POST',
      url: '/api',
      params: saveData
    }).then(data => {

      // Set cookies after server response so we don't save bad data to cookies
      setCookies([
        { name: 'name', value: saveData.name },
        { name: 'expiration', value: saveData.expiration },
        { name: 'privacy', value: saveData.privacy }
      ]);

      // If there is a secretKey let's redirect them to a page that shows
      // the docKey & secretKey, otherwise send them directly to the new paste
      const redirect = (secretKey) ? {
        pathname: `/saved`,
        state: { docKey: data.key, secretKey }
      } : {
        pathname: `/${data.key}`
      };
      this.setState({ redirect });
    })
    .catch((err) => {
      if (err) {
        this.setState({ errors: err.message });
      }
    });
  };

  /**
   * Stateless component to render the tab options
   */
  TabOptions = () => (
    <div className="tab-options">
      <span
        className={this.state.tabOption === PasteView.tabOptions.text ? 'active' : ''}
        onClick={() => this.setState({ tabOption: PasteView.tabOptions.text })}>
        Text
      </span>
      <Condition condition={!this.state.fromEdit}>
        <span
          className={this.state.tabOption === PasteView.tabOptions.upload ? 'active' : ''}
          onClick={() => this.setState({
            tabOption: PasteView.tabOptions.upload,
            privacy: (this.state.privacy === privacyOptions.encrypted) ?
              privacyOptions.private : this.state.privacy
          })}
        >
          File Upload
        </span>
      </Condition>
      <Condition condition={this.state.fromEdit}>
        <span
          className={this.state.tabOption === PasteView.tabOptions.diff ? 'active' : ''}
          onClick={() => this.setState({ tabOption: PasteView.tabOptions.diff })}
        >
          Show Diff
        </span>
      </Condition>
    </div>
  );

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} push={true} />;
    }

    return (
      <div
        className={`view`}
        onPaste={this.onPaste}
      >
        <HeaderBlock
          saveButton={this.saveButton}
          disabled={{ raw: true, edit: true, save: !this.hasText() }}
        />
        <div className="view-container flex-col">
          <Condition
            value={this.state.errors}
            className="red-text text-center"
          />
          <div className="options-container">
            <div className="option">
              <span className="label">Title:</span>
              <input
                type="text"
                name="title"
                value={this.state.title}
                placeholder="Untitled"
                onChange={this.handleChange}
              />
            </div>
            <div className="option">
              <span className="label">Name:</span>
              <input
                type="text"
                name="name"
                value={this.state.name}
                placeholder="Name (Optional)"
                onChange={this.handleChange}
              />
            </div>
            <div className="option">
              <span className="label">Expiration:</span>
              <select
                name="expiration"
                value={this.state.expiration}
                onChange={this.handleChange}
              >
                {expirationOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="radio-options">
              <div className="radio-option">
                <input
                  type="radio"
                  name="public"
                  value={privacyOptions.public}
                  checked={this.state.privacy === privacyOptions.public}
                  onChange={this.handlePrivacyRadio}
                />
                Public
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  name="private"
                  value={privacyOptions.private}
                  checked={this.state.privacy === privacyOptions.private}
                  onChange={this.handlePrivacyRadio}
                />
                Private
              </div>
              <Condition
                condition={this.state.tabOption !== PasteView.tabOptions.file}
              >
                <div className="radio-option">
                  <input
                    type="radio"
                    name="encrypt"
                    value={privacyOptions.encrypted}
                    checked={this.state.privacy === privacyOptions.encrypted}
                    onChange={this.handlePrivacyRadio}
                  />
                  Private w/AES
                </div>
              </Condition>
            </div>
          </div>

          <Condition condition={this.state.fromEdit}>
            <div className="text-center light-blue-text">
              Forked from&nbsp;
              <Link to={`/${this.state.docKeyFromEdit}`}>
                {this.state.docKeyFromEdit}
              </Link>
            </div>
          </Condition>

          <Condition
            condition={this.state.tabOption === PasteView.tabOptions.text}
          >
            <div className="text-container">
              <this.TabOptions />
              <textarea
                ref={(textarea) => { this.textArea = textarea; }}
                className="hljs"
                name="text"
                placeholder="  Paste Text Here"
                value={this.state.text}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
                spellCheck="false"
                onDragEnter={() => this.setState({
                  tabOption: PasteView.tabOptions.upload,
                  privacy: (this.state.privacy === privacyOptions.encrypted) ?
                    privacyOptions.private : this.state.privacy
                })}
              />
            </div>
          </Condition>

          <Condition
            condition={this.state.tabOption === PasteView.tabOptions.diff}
          >
            <div className="text-container">
              <this.TabOptions />
              <DiffBlock
                oldText={this.state.rawTxtFromEdit}
                newText={this.state.text}
              />
            </div>
          </Condition>

          <Condition
            condition={this.state.tabOption === PasteView.tabOptions.upload}
          >
            <div className="upload-container">
              <this.TabOptions />
              <Dropzone
                className="dropzone"
                onDrop={this.onDrop}
                multiple={false}
              >
                <div>
                  <div>Drag a file here or click to open dialogue.</div>
                  <div>
                    (Files will be deleted regularly to conserve storage.)
                  </div>
                </div>
              </Dropzone>
            </div>
          </Condition>

        </div>
      </div>
    );
  }

}

PasteView.contextTypes = {
  styleStore: PropTypes.object
};

PasteView.displayName = 'PasteView';

export default PasteView;

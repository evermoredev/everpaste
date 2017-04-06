import React  from 'react';
import { HeaderBlock } from '../blocks';
import { doRequest } from '../../modules/request';
import { setCookie, getCookie } from '../../modules/cookies';
import CryptoJS from 'crypto-js';
import { privacyOptions } from '../../../shared/config/constants';
import { Condition } from '../../modules/components';
import { Redirect } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { fileValidation, pasteValidation } from '../../../shared/validations/paste';

class PasteView extends React.Component {

  static tabOptions = {
    text: 1,
    upload: 2
  };

  constructor(props) {
    super(props);

    // If we're coming from an edit, grab the currentPaste data
    if (this.props.location.state && this.props.location.state.currentPaste) {
      this.rawTxtFromEdit = this.props.location.state.currentPaste.rawText;
      this.titleFromEdit = this.props.location.state.currentPaste.title;
      this.docKeyFromEdit = this.props.location.state.currentPaste.docKey;
    }

    // Set some defaults
    this.state = {
      age: Date.now(),
      from: this.docKeyFromEdit,
      title: this.titleFromEdit || '',
      name: getCookie('name') || '',
      text: this.rawTxtFromEdit || '',
      file: null,
      expiration: getCookie('expiration') || '1 days',
      privacy: this.getPrivacyOption(getCookie('privacy')),
      errors: '',
      redirect: null,
      tabOption: PasteView.tabOptions.text
    };

    this.initialState = this.state;
  }

  componentWillReceiveProps(nextProps, nextState) {
    // This is a way to get the page to return to initial state if the
    // user clicks the new paste button while on this route already
    if (nextProps.location.state && nextProps.location.state.clicked) {
      this.setState(this.initialState);
      this.setState({ age: Date.now() });
    }
  }

  /**
   * Determines if the paste has enough text to be saved
   */
  hasText = () => (this.state.text && this.state.text.length >= 3);

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  handlePrivacyRadio = (event) =>
    this.setState({ privacy: event.currentTarget.value });

  /**
   * Handle dropping of a file to the Dropzone
   * @param file
   */
  onDrop = (file) => {
    const validate = fileValidation(file);
    if (validate.passed) {
      // Don't re-render, save one file
      this.state.file = file[0];
      // Invoke saving automatically
      this.saveButton();
    } else {
      this.setState({ errors: validate.errors });
    }
  };

  /**
   * Returns the privacy option if it exists, otherwise public
   * @param option
   */
  getPrivacyOption = (option) =>
    (Object.keys(privacyOptions).includes(option)) ? option : privacyOptions.public;

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
    if (this.state.privacy == privacyOptions.encrypted) {
      let arr = new Uint8Array(1024);
      // User the non armored key for encryption
      let encryptKey = String.fromCharCode(...window.crypto.getRandomValues(arr));
      // Create the user friendly/armored key for display
      secretKey = btoa(encryptKey);
      // Encrypt the text to be sent to the server
      saveData.text = CryptoJS.AES.encrypt(saveData.text, encryptKey).toString();
    }

    // TODO: Set multiple cookies at once
    setCookie('name', saveData.name);
    setCookie('expiration', saveData.expiration);
    setCookie('privacy', saveData.privacy);

    // Make the request
    doRequest({
      method: 'POST',
      url: '/api',
      params: saveData
    }).then(data => {
      // If there is a secretKey let's redirect them to a page that shows
      // the docKey and the secretKey, otherwise send them directly to the new paste
      let redirect = (secretKey) ? {
          pathname: `/saved`,
          state: { docKey: data.key, secretKey }
        } : {
          pathname: `/${data.key}`
        };
      this.setState({ redirect });
    }).catch(err => {
      this.setState({ errors: err.message });
    });
  };

  /**
   * Stateless component to render the tab options
   */
  TabOptions = () => (
    <div className="tab-options">
      <span
        className={this.state.tabOption == PasteView.tabOptions.text ? 'active' : ''}
        onClick={() => this.setState({ tabOption: PasteView.tabOptions.text })}>
        Text
      </span>
      <span
        className={this.state.tabOption == PasteView.tabOptions.upload ? 'active' : ''}
        onClick={() => this.setState({
          tabOption: PasteView.tabOptions.upload,
          privacy: privacyOptions.public
        })}>
        File Upload
      </span>
    </div>
  );

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;

    return (
      <div className={`paste-view flex-container ${this.context.styleStore.theme}`}>
        <HeaderBlock
          saveButton={this.saveButton}
          disabled={{ raw: true, edit: true, save: !this.hasText() }}
        />
        <div className="view-container">
          <Condition value={this.state.errors} className="error-messages" />
          <div className="options-container">
            <div className="option">
              <span className="label">Title:</span>
              <input
                className="input-dark"
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
                className="input-dark"
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
                className="input-dark"
                name="expiration"
                value={this.state.expiration}
                onChange={this.handleChange}
              >
                <option value="forever">Forever</option>
                <option value="1 weeks">1 Week</option>
                <option value="1 days">1 Day</option>
                <option value="6 hours">6 Hours</option>
                <option value="30 minutes">30 Minutes</option>
              </select>
            </div>
            <div className="option">
              <div className="radio-option">
                <input
                  className="radio"
                  type="radio"
                  name="public"
                  value={privacyOptions.public}
                  checked={this.state.privacy == privacyOptions.public}
                  onChange={this.handlePrivacyRadio}
                />
                Public
              </div>
              <div className="radio-option">
                <input
                  className="radio"
                  type="radio"
                  name="private"
                  value={privacyOptions.private}
                  checked={this.state.privacy == privacyOptions.private}
                  onChange={this.handlePrivacyRadio}
                />
                Private
              </div>
              <Condition condition={this.state.tabOption == PasteView.tabOptions.text}>
                <div className="radio-option">
                  <input
                    className="radio"
                    type="radio"
                    name="encrypt"
                    value={privacyOptions.encrypted}
                    checked={this.state.privacy == privacyOptions.encrypted}
                    onChange={this.handlePrivacyRadio}
                  />
                  Private w/AES
                </div>
              </Condition>

            </div>
          </div>

          <Condition condition={this.state.tabOption == PasteView.tabOptions.text}>
            <div className="text-container">
              <this.TabOptions />
              <textarea
                key={this.state.age}
                className="hljs"
                name="text"
                placeholder="  Paste Text Here"
                defaultValue={this.state.text}
                onChange={this.handleChange}
                spellCheck="false"
                onDragEnter={() => this.setState({tabOption: PasteView.tabOptions.upload})}
              />
            </div>
          </Condition>

          <Condition condition={this.state.tabOption == PasteView.tabOptions.upload}>
            <div className="upload-container">
              <this.TabOptions />
              <Dropzone className="dropzone" onDrop={this.onDrop} multiple={false}>
                <div>
                  <div>Drag a file here or click to open dialogue.</div>
                  <div>(Files will be deleted regularly to conserve storage.)</div>
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
  styleStore: React.PropTypes.object
};

export default PasteView;

import React  from 'react';
import { HeaderBlock } from '../blocks';
import { doRequest } from '../../modules/request';
import { setCookie, getCookie } from '../../modules/cookies';
import CryptoJS from 'crypto-js';
import { privacyOptions } from '../../../shared/config/constants';
import { Condition } from '../../modules/components';
import { Redirect } from 'react-router-dom';

class PasteView extends React.Component {

  constructor(props) {
    super(props);

    if (this.props.location.state && this.props.location.state.currentPaste) {
      this.rawTxtFromEdit = this.props.location.state.currentPaste.rawText;
      this.titleFromEdit = this.props.location.state.currentPaste.title;
      this.docKeyFromEdit = this.props.location.state.currentPaste.docKey;
    }

    this.state = {
      age: Date.now(),
      from: this.docKeyFromEdit,
      title: this.titleFromEdit || '',
      name: getCookie('name') || '',
      text: this.rawTxtFromEdit || '',
      expiration: getCookie('expiration') || '1 days',
      privacy: this.getPrivacyOption(getCookie('privacy')),
      errors: '',
      redirect: null
    };

    this.initialState = this.state;
  }

  /**
   * Determines if the paste has enough text to be saved
   */
  hasText = () => (this.state.text && this.state.text.length >= 3);

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  handlePrivacyRadio = (event) =>
    this.setState({ privacy: event.currentTarget.value });

  getPrivacyOption = (option) =>
    (Object.keys(privacyOptions).includes(option)) ? option : privacyOptions.public;

  saveButton = () => {

    // Do some validation and formatting
    const errors = [];
    if (!this.hasText()) {
      errors.push('Please enter more text to save.');
    }

    let { name, title, text, expiration, privacy, secretKey } = this.state;

    if (this.state.privacy == privacyOptions.encrypted) {
      let arr = new Uint8Array(1024);
      // User the non armored key for encryption
      let encryptKey = String.fromCharCode(...window.crypto.getRandomValues(arr));
      // Create the user friendly/armored key for display
      secretKey = btoa(encryptKey);
      // Encrypt the text to be sent to the server
      text = CryptoJS.AES.encrypt(this.state.text, encryptKey).toString();
    }

    if (errors.length) {
      this.setState({ errors });
    } else {
      setCookie('name', name);
      setCookie('expiration', expiration);
      setCookie('privacy', privacy);
      doRequest({
        method: 'POST',
        url: '/api',
        params: { title, text, name, expiration, privacy }
      }).then(data => {
        console.log(data);
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
          console.log(err);
          errors.push(err);
          this.setState({ errors });
        });
    }
  };

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.location.state && nextProps.location.state.clicked) {
      this.setState(this.initialState);
      this.setState({ age: Date.now() });
    }
  }

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
            </div>
          </div>

          <div className="text-container">
            <textarea
              key={this.state.age}
              className="hljs"
              name="text"
              placeholder="  Paste Text Here"
              defaultValue={this.state.text}
              onChange={this.handleChange}
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    );
  }

}

PasteView.contextTypes = {
  styleStore: React.PropTypes.object
};

export default PasteView;

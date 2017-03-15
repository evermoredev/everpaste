import React  from 'react';
import { HeaderBlock } from '../blocks';
import axios from 'axios';
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
      window.crypto.getRandomValues(arr);
      secretKey = btoa(String.fromCharCode(...arr));
      text = CryptoJS.AES.encrypt(this.state.text, secretKey).toString();
    }

    if (errors.length) {
      this.setState({ errors });
    } else {
      setCookie('name', name);
      setCookie('expiration', expiration);
      setCookie('privacy', privacy);
      axios.post('/api', {
        title, text, name, expiration, privacy
      }).then(res => {
        // If there is a secretKey let's redirect them to a page that shows
        // the docKey and the secretKey, otherwise send them directly to the new paste
        let redirect = (secretKey) ? {
            pathname: `/saved`,
            state: { docKey: res.data.key, secretKey }
          } : {
            pathname: `/${res.data.key}`
          };
        this.setState({ redirect });
      }).catch(err => {
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
    if (this.state.redirect) {
      return (
        <Redirect to={this.state.redirect} />
      );
    }
    return (
      <div className={`paste-view flex-container ${this.context.styleStore.theme}`}>
        <HeaderBlock
          saveButton={this.saveButton}
          disabled={{ raw: true, edit: true, save: !this.hasText() }}
        />
        <div className="view-container">
            <div className="error-messages">{this.state.errors}</div>
            <div className="title-container">
              <input
                placeholder="Enter a Title"
                name="title"
                value={this.state.title}
                onChange={this.handleChange}
              />
            </div>
            <div className="option-container">
              <form className="pure-form">
                <fieldset>
                  <div style={{ display: 'inline-block', textAlign: 'right', width: '50%' }}>
                    <div>
                      <label htmlFor="name">
                        Name:
                        <input
                          style={{ marginLeft: '10px' }}
                          className="input-dark"
                          type="text"
                          name="name"
                          value={this.state.name}
                          placeholder="Name (Optional)"
                          onChange={this.handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="expiration">
                        Expiration:
                        <select
                          style={{ width: "187px" }}
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
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'inline-block', textAlign: 'left', width: '50%' }}>
                    <div>
                    <label htmlFor="public">
                      <input
                        className="pure-radio"
                        type="radio"
                        name="public"
                        value={privacyOptions.public}
                        checked={this.state.privacy == privacyOptions.public}
                        onChange={this.handlePrivacyRadio}
                      />
                      Public
                    </label>
                    <label htmlFor="private">
                      <input
                        style={{ marginLeft: '10px' }}
                        className="pure-radio"
                        type="radio"
                        name="private"
                        value={privacyOptions.private}
                        checked={this.state.privacy == privacyOptions.private}
                        onChange={this.handlePrivacyRadio}
                      />
                      Private
                    </label>
                    </div>
                    <div>
                    <label htmlFor="encrypt">
                      <input
                        className="pure-radio"
                        type="radio"
                        name="encrypt"
                        value={privacyOptions.encrypted}
                        checked={this.state.privacy == privacyOptions.encrypted}
                        onChange={this.handlePrivacyRadio}
                      />
                      Private w/AES
                    </label>
                    </div>
                  </div>

                </fieldset>
              </form>
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

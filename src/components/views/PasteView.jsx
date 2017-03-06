import React  from 'react';
import { HeaderBlock } from '../blocks';
import axios from 'axios';
import { setCookie, getCookie } from '../../modules/cookies';

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
      privacyPublic: getCookie('public') == 'true',
      errors: ''
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
    this.setState({ privacyPublic: event.currentTarget.value === 'public' });

  saveButton = () => {
    // Do some validation and formatting
    const errors = [];
    if (!this.hasText()) {
      errors.push('Please enter more text to save.');
    }

    const { name, title, text, expiration, privacyPublic } = this.state;
    if (errors.length) {
      this.setState({ errors });
    } else {
      setCookie('name', name);
      setCookie('expiration', expiration);
      setCookie('public', privacyPublic);
      axios.post('/api', {
        title, text, name, expiration, privacyPublic
      }).then(res => {
        window.location = '/' + res.data.key;
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
    console.log(this.state.privacyPublic);
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
                  <label htmlFor="public">
                    <input
                      className="pure-radio"
                      type="radio"
                      name="public"
                      value="public"
                      checked={this.state.privacyPublic}
                      onChange={this.handlePrivacyRadio}
                    />
                    Public
                  </label>
                  <label htmlFor="private">
                    <input
                      className="pure-radio"
                      type="radio"
                      name="private"
                      value="private"
                      checked={!this.state.privacyPublic}
                      onChange={this.handlePrivacyRadio}
                    />
                    Private
                  </label>
                  <label htmlFor="name">
                    <input
                      className="input-dark"
                      type="text"
                      name="name"
                      value={this.state.name}
                      placeholder="Name (Optional)"
                      onChange={this.handleChange}
                    />
                  </label>
                  <label htmlFor="expiration">
                    Expiration:
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
                  </label>
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

import React  from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';
import Redirect from 'react-router/Redirect'

import HeaderLayout from 'components/layouts/HeaderLayout';

@observer
class PasteView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      name: '',
      text: this.props.text || '',
      expiration: '1 days',
      privacyPublic: true,
      errors: [],
      redirect: '',
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  saveButton = () => {
    let { title, text, name, privacyPublic, expiration } = this.state;
    // Do some validation and formatting
    let errors = [];
    if (!text || text.length < 3) {
      errors.push("Please enter some text to save.");
    }

    if (errors.length) {
      this.setState({ errors });
    } else {
      axios.post('/api', {
        title, text, name, expiration, privacyPublic
      }).then(res => {
        this.setState({redirect: res.data.key});
      }).catch(err => {
        errors.push(err);
        this.setState({ errors });
      })
    }
  };

  handlePrivacyRadio = (event) => {
    this.setState({
      privacyPublic: event.currentTarget.value === 'public'
    })
  };

  render() {
    return (
      <div className="main-container">
        {this.state.redirect && <Redirect to={`/${this.state.redirect}`} />}
        <HeaderLayout saveButton={this.saveButton} />
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
                  type="text"
                  name="name"
                  value={this.state.name}
                  placeholder="Name (Optional)"
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="expiration">
                Expiration:
              </label>
              <select
                name="expiration"
                value={this.state.expiration}
                onChange={this.handleChange}
              >
                <option value="forever">Forever</option>
                <option value="1 weeks">1 Week</option>
                <option value="1 days">1 Day</option>
                <option value="1 hours">1 Hour</option>
                <option value="10 minutes">10 Minutes</option>
              </select>
            </fieldset>
          </form>
        </div>

        <div className="text-container">
          <textarea
            name="text"
            placeholder="&#xf040;  Paste Text Here" // Font icon Added
            defaultValue={this.state.text}
            onChange={this.handleChange}
            spellCheck="false"
          />
        </div>
      </div>
    );
  }

}

export default PasteView;

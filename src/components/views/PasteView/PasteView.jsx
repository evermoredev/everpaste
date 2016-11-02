import React  from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';
import Redirect from 'react-router/Redirect'

import { HeaderLayout } from 'components/layouts';

@observer(['GlobalStore', 'ViewsStore'])
class PasteView extends React.Component {

  constructor(props) {
    super(props);

    this.props.GlobalStore.currentView = 'PasteView';

    // If we got here from the edit link, let's copy over the stored text
    let defaultTxt = this.props.location.state && this.props.location.state.editLink ?
      this.props.ViewsStore.readViewText : '';

    this.state = {
      title: '',
      name: '',
      text: defaultTxt || '',
      expiration: '1 days',
      privacyPublic: true,
      errors: [],
      redirect: '',
    };

    // Reset the text stored from ReadView
    this.props.ViewsStore.readViewText = '';
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
      <div className="paste-view">
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
              </label>
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
            </fieldset>
          </form>
        </div>
        <div className="text-container">
          <textarea
            className="hljs"
            name="text"
            placeholder="  Paste Text Here"
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

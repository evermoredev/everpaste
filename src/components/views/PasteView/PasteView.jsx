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
      text: '',
      public: true,
      errors: '',
      redirect: '',
      selectedRadio: 'public'
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  saveButton = () => {
    console.log('save button pressed');
    axios.post('/api', {
      title: this.state.title,
      text: this.state.text
    }).then(res => {
      console.log('/api post response', res);
      this.setState({ redirect: res.data.key });
    }).catch(err => {
      console.log(err);
    })
  };

  handleRadioChange = (event) => {
    this.setState({
      selectedRadio: event.currentTarget.value
    })
  };

  render() {
    return (
      <div className="main-container">
        {this.state.redirect && <Redirect to={`/${this.state.redirect}`} />}
        <HeaderLayout saveButton={this.saveButton} />
        <div id="messages">{this.state.errors}</div>
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
                  checked={this.state.selectedRadio === 'public'}
                  onChange={this.handleRadioChange}
                />
                Public
              </label>
              <label htmlFor="private">
                <input
                  className="pure-radio"
                  type="radio"
                  name="private"
                  value="private"
                  checked={this.state.selectedRadio === 'private'}
                  onChange={this.handleRadioChange}
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
              <label htmlFor="alive-time">
                Expiration:
              </label>
              <select id="alive-time" name="alive-time" defaultValue="Forever">
                <option value="Forever">Forever</option>
                <option value="1 Week">1 Week</option>
                <option value="24 Hour">24 Hours</option>
                <option value="1 Hour">1 Hour</option>
                <option value="10 Minutes">10 Minutes</option>
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

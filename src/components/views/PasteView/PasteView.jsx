import React  from 'react';
import { observer } from 'mobx-react';
import Redirect from 'react-router/Redirect'

import PasteViewStore from './PasteViewStore';

@observer(['AppStore', 'ViewsStore'])
class PasteView extends React.Component {

  constructor(props) {
    super(props);
    console.log('PasteView props', props);
  }

  componentWillMount() {
    console.log('Creating new PasteViewStore');
    this.store = new PasteViewStore(this.props);
  };

  render() {
    return (
      <div className="paste-view">
        {console.log('this.store.redirect:', this.store.redirect)}
        {this.store.redirect && <Redirect to={`/${this.store.redirect}`} />}
        <div className="error-messages">{this.store.getErrors()}</div>
        <div className="title-container">
          <input
            placeholder="Enter a Title"
            name="title"
            value={this.store.title}
            onChange={this.store.handleChange}
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
                  checked={this.store.privacyPublic}
                  onChange={this.store.handlePrivacyRadio}
                />
                Public
              </label>
              <label htmlFor="private">
                <input
                  className="pure-radio"
                  type="radio"
                  name="private"
                  value="private"
                  checked={!this.store.privacyPublic}
                  onChange={this.store.handlePrivacyRadio}
                />
                Private
              </label>
              <label htmlFor="name">
                <input
                  className="input-dark"
                  type="text"
                  name="name"
                  value={this.store.name}
                  placeholder="Name (Optional)"
                  onChange={this.store.handleChange}
                />
              </label>
              <label htmlFor="expiration">
                Expiration:
                <select
                  className="input-dark"
                  name="expiration"
                  value={this.store.expiration}
                  onChange={this.store.handleChange}
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
            className="hljs"
            name="text"
            placeholder="  Paste Text Here"
            defaultValue={this.store.text}
            onChange={this.store.handleChange}
            spellCheck="false"
          />
        </div>
      </div>
    );
  }

}

export default PasteView;

import { action, observable, autorun, asReference } from 'mobx';
import axios from 'axios';
import cookie from 'cookie';

class PasteViewStore {

  constructor(props) {
    this.props = props;

    this.cookies = cookie.parse(document.cookie);
    this.defaultExpiration = this.cookies.expiration || '1 days';
    this.defaultName = this.cookies.name || '';

    // If we got here from the edit link, let's copy over the stored text
    this.defaultTxt = this.props.pathname == '/edit' ?
      this.props.ViewsStore.current.text : '';

    this.defaultTitle = this.props.pathname == '/edit' ?
      this.props.ViewsStore.current.title : '';

    this.setCurrentView();
  }

  @observable title = this.defaultTitle || '';
  @observable name = this.defaultName || '';
  @observable text = this.defaultTxt || '';
  @observable expiration = this.defaultExpiration;
  @observable privacyPublic = true;
  @observable redirect = '';
  @observable errors = [];

  @action
  setCurrentView = () => {
    this.props.ViewsStore.current = observable({
      currentView: 'PasteView',
      saveButton: asReference(this.saveButton)
    });
  };

  @action
  handleChange = (event) => this[event.target.name] = event.target.value;

  @action
  getErrors = () => this.errors;

  @action
  saveButton = () => {
    // Do some validation and formatting
    console.log('save button pressed');
    let errors = [];
    if (!this.text || this.text.length < 3) {
      errors.push('Please enter more text to save.');
    }

    if (errors.length) {
      this.errors = errors;
    } else {
      // Set the cookies
      document.cookie = cookie.serialize('name', String(this.name));
      document.cookie = cookie.serialize('expiration', String(this.expiration));
      axios.post('/api', {
        title: this.title,
        text: this.text,
        name: this.name,
        expiration: this.expiration,
        privacyPublic: this.privacyPublic
      }).then(res => {
        this.redirect = res.data.key;
      })
        .catch(err => {
          errors.push(err);
          this.errors = errors;
      });
    }
  };

  @action
  handlePrivacyRadio = (event) =>
    this.privacyPublic = event.currentTarget.value === 'public'

}

export default PasteViewStore;

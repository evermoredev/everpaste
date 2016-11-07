import { action, observable, autorun } from 'mobx';
import axios from 'axios';

class PasteViewStore {

  constructor(props) {
    this.props = props;

    // If we got here from the edit link, let's copy over the stored text
    this.defaultTxt = this.props.pathname == '/edit' ?
      this.props.ViewsStore.current.text : '';

    this.props.ViewsStore.current = {
      currentView: 'PasteView',
      saveButton: this.saveButton
    };

    this.errors = [];
  }

  @observable title = '';
  @observable name = '';
  @observable text = this.defaultTxt || '';
  @observable expiration = '1 days';
  @observable privacyPublic = true;
  @observable redirect = '';

  @action
  handleChange = (event) => this[event.target.name] = event.target.value;

  @autorun @action
  getErrors = () => this.errors;

  @autorun @action
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
      axios.post('/api', {
        title: this.title,
        text: this.text,
        name: this.name,
        expiration: this.expiration,
        privacyPublic: this.privacyPublic
      }).then(res => {
        console.log('saveButton response:', res.data);
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

import { action, observable, autorun, asReference } from 'mobx';
import axios from 'axios';

class PasteViewStore {

  constructor(props) {
    this.props = props;

    // If we got here from the edit link, let's copy over the stored text
    this.defaultTxt = this.props.pathname == '/edit' ?
      this.props.ViewsStore.current.text : '';

    this.defaultTitle = this.props.pathname == '/edit' ?
      this.props.ViewsStore.current.title : '';

    this.setCurrentView();
  }

  @observable title = this.defaultTitle;
  @observable name = '';
  @observable text = this.defaultTxt;
  @observable expiration = '1 days';
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

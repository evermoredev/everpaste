import { action, observable } from 'mobx';
import axios from 'axios';

class ReadViewStore {

  constructor(props) {
    this.props = props;

    this.props.ViewsStore.current = {
      currentView: 'ReadView',
      docKey: this.docKey
    };
  }

  @observable title = '';
  @observable text = '';
  @observable name = '';
  @observable docKey = '';

  @action
  getDoc = (key) => {
    axios
      .get(`/api/${key}`)
      .then(res => {
        this.title = res.data.title;
        this.text = res.data.text;
        this.name = res.data.name;
        this.docKey = res.data.docKey;
        // Set the text on the ViewsStore current object in case they edit
        this.props.ViewsStore.current.text = res.data.rawText;
        this.props.ViewsStore.current.docKey = res.data.docKey;
      })
      .catch(error => {
        window.location = '/404';
      });
  };

}

export default ReadViewStore;

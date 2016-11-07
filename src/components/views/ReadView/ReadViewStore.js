import { action, observable } from 'mobx';
import axios from 'axios';

class ReadViewStore {

  constructor(props) {
    this.props = props;

    this.props.ViewsStore.current = {
      currentView: 'ReadView',
      text: this.text,
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
      })
      .catch(error => {
        console.log(error);
      });
  };

}

export default ReadViewStore;

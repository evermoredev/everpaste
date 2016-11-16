import { action, observable } from 'mobx';
import axios from 'axios';

class ReadViewStore {

  constructor(props) {
    this.props = props;
    this.setCurrentView();
  }

  @observable title = '';
  @observable text = '';
  @observable name = '';
  @observable docKey = '';

  @action
  setCurrentView = () => {
    this.props.ViewsStore.current = observable({
      currentView: 'ReadView',
      docKey: this.docKey
    });
  };

  @action
  getDoc = (docKey) => {
    axios
      .get(`/api/${docKey}`)
      .then(res => {
        this.title = res.data.title;
        this.text = res.data.text;
        this.name = res.data.name;
        this.docKey = res.data.key;
        // Set the text on the ViewsStore current object in case they edit
        this.props.ViewsStore.current.text = res.data.rawText;
        this.props.ViewsStore.current.docKey = res.data.key;
        this.props.ViewsStore.current.title = res.data.title;
      })
      .catch(error => {
        window.location = '/404';
      });
  };

}

export default ReadViewStore;

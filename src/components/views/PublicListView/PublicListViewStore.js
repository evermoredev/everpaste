import { action, observable, autorun, asReference } from 'mobx';
import axios from 'axios';

class PublicListViewStore {

  constructor(props) {
    this.props = props;

    this.setCurrentView();
  }

  @observable docList = [];
  @observable loading = true;

  @action
  setCurrentView = () => {
    this.props.ViewsStore.current = observable({
      currentView: 'PublicListView'
    });
  };

  @action
  getDocList = () => {
    axios
      .get('/api/list')
      .then(res => {
        this.docList = res.data.reverse();
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
      });
  };

}

export default PublicListViewStore;

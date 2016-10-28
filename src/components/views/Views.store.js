import { observable, action, autorun } from 'mobx';

class ViewsStore {

  // Text loaded from the readView. Used for default text.
  @observable readViewText = '';

}

export default new ViewsStore();

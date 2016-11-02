import { observable } from 'mobx';

class GlobalStore {

  @observable currentView = '';
  @observable docKey='';

}

export default new GlobalStore();

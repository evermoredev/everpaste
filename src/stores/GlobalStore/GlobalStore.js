import { observable } from 'mobx';

class GlobalStore {

  @observable currentView = 'Paste';

}

export default new GlobalStore();

import { observable } from 'mobx';

class ViewStore {

  // Stores what is our current view route
  @observable currentView = 'LandingView';
  @observable currentUser = null;

}

export default ViewStore;

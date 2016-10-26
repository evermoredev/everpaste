import { action, observable } from 'mobx';

class HeaderLayoutState {

  @observable mobileNavigationClass = 'mobile-navigation';

  constructor() {
    this.isMobileNavigationToggled = true;
  }

  @action
  handleMobileNaviconClick = (event) => {
    event.preventDefault();
    if (this.isMobileNavigationToggled) {
      this.mobileNavigationClass = 'mobile-navigation active';
      this.isMobileNavigationToggled = false;
    } else {
      this.mobileNavigationClass = 'mobile-navigation';
      this.isMobileNavigationToggled = true;
    }
  };
}

export default new HeaderLayoutState;

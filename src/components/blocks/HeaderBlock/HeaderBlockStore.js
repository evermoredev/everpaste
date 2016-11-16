import React from 'react';
import { action, observable, autorunAsync } from 'mobx';

class HeaderBlockStore {

  constructor(props) {
    this.props = props;
    this.isMobileNavigationToggled = true;
  }

  @observable mobileNavigationClass = 'mobile-navigation';

  @action
  saveButton = (event) => {
    event.preventDefault();
    if (this.props.ViewsStore.current.saveButton) {
      this.props.ViewsStore.current.saveButton();
    }
  };

  @action
  rawButton = (event) => {
    if (this.props.ViewsStore.current.currentView == 'ReadView' && this.props.ViewsStore.current.docKey) {
      window.open(`${window.location.host}/raw/${this.props.ViewsStore.current.docKey}`, '_blank');
    }
  };

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

export default HeaderBlockStore;

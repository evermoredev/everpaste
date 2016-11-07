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
  handleRawLink = (event) => {
    if (this.props.ViewsStore.currentView != 'ReadView' || !this.props.ViewsStore.docKey) {
      event.preventDefault();
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

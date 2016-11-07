import { action, observable, autorunAsync } from 'mobx';

class SettingsViewStore {

  constructor(props) {
    this.props = props;

    this.props.ViewsStore.current = {
      currentView: 'SettingsView'
    };
  }

}

export default SettingsViewStore;

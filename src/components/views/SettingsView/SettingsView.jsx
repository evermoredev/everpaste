import React from 'react';
import { observer } from 'mobx-react';

import { HeaderLayout } from 'components/layouts';

@observer(['GlobalStore'])
class SettingsView extends React.Component {

  constructor(props) {
    super(props);

    this.props.GlobalStore.currentView = 'SettingsView';
  }

  render() {
    return(
      <div className="settings-view">
        <HeaderLayout />
        Settings View
      </div>
    );
  }

}

export default SettingsView;
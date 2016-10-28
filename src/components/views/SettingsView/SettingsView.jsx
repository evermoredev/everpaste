import React from 'react';
import { observer } from 'mobx-react';

@observer(['GlobalStore', 'StyleStore', 'ViewStore'])
class SettingsView extends React.Component {

  constructor(props) {
    super(props);
  }

  renderThemeSelections = () => this.props.StyleStore.themes.map(theme => {
    return (
      <div
        className="theme-select"
        key={theme}
        onClick={this.props.StyleStore.setTheme(theme + '-theme')}
      >
        {theme}
      </div>
    );
  });

  render() {
    return (
      <div className="settings-view">
        {this.renderThemeSelections()}
      </div>
    );
  }

}

export default SettingsView;

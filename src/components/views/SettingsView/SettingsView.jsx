import React from 'react';
import { observer } from 'mobx-react';

import { HeaderLayout } from 'components/layouts';

@observer(['GlobalStore', 'StyleStore'])
class SettingsView extends React.Component {

  constructor(props) {
    super(props);

    this.props.GlobalStore.currentView = 'SettingsView';
  }

  handleThemeChange = (event, className) => {
    this.props.StyleStore.setTheme(className);
  };

  renderThemesList = () => this.props.StyleStore.themes.map((t, idx) =>
    <div
      key={idx}
      className={t.className}
      onClick={() => this.handleThemeChange(event, t.className)}>
        <span className="hljs-keyword">A</span>
        <span className="hljs-type">B</span>
        <span className="hljs-symbol">C</span>
        <span className="hljs-string">D</span>
        {t.name}
    </div>
  );

  render() {
    return(
      <div className="settings-view">
        <HeaderLayout />
        <div className="code-sample">
        </div>
        <div className="style-reset">
          {this.renderThemesList()}
        </div>
      </div>
    );
  }

}

export default SettingsView;
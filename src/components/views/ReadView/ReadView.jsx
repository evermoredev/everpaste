import React from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';

import HeaderLayout from 'components/layouts/HeaderLayout';

@observer
class ReadView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      text: '',
      name: '',
      docKey: '',
      loaded: false,
      currentTheme: 'dracula-theme'
    };
  }

  componentDidMount() {
    this.getDoc(this.props.params.key);
  }

  handleThemeChange = (event) => {
    console.log('Theme Selected: ', event.target.value);
    this.setState({
      currentTheme: event.target.value
    })
  };

  getDoc = (key) => {
    axios
      .get(`/api/${key}`)
      .then(res => {
        // Clone the old state so that we only setState once
        const newState =
          Object.assign({}, this.state, res.data);
        this.setState(newState);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="main-container">
        <HeaderLayout docKey={this.state.key} />
        <div id="messages"></div>
        <div className="code-information-container">
          <div className="unselectable code-title">
            {this.state.title || 'Untitled'}
            {this.state.name &&
            <span className="from-name">from {this.state.name}</span>
            }
          </div>
          <div className="code-theme-selector">
            <div>
              <label htmlFor="code-theme">
                Current Theme:
              </label>
              <select
                name="code-theme"
                value={this.state.currentTheme}
                onChange={this.handleThemeChange}
              >
                <option value="dracula-theme">Dracula</option>
                <option value="androidstudio-theme">Android Studio</option>
                <option value="atelier-forest-light-theme">Atelier Light</option>
              </select>
            </div>
          </div>
        </div>
        <div className={`code-document ${this.state.currentTheme}`}>
          <pre>
            <code dangerouslySetInnerHTML={{ __html: this.state.text }} />
          </pre>
        </div>
      </div>
    );
  }

}

export default ReadView;

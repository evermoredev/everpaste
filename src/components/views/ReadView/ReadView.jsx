import React from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';

import { HeaderLayout } from 'components/layouts';

@observer(['GlobalStore', 'ViewsStore', 'StyleStore'])
class ReadView extends React.Component {

  constructor(props) {
    super(props);

    this.props.GlobalStore.currentView = 'ReadView';

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
    this.props.StyleStore.setTheme(event.target.value);
    this.setState({
      currentTheme: event.target.value
    });
  };

  getDoc = (key) => {
    axios
      .get(`/api/${key}`)
      .then(res => {
        // Clone the old state so that we only setState once
        const newState =
          Object.assign({}, this.state, res.data);
        this.setState(newState);
        // Store the text that get's loaded in case they click edit.
        this.props.ViewsStore.readViewText = res.data.rawText;
        this.props.GlobalStore.readViewDocKey = key;
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="code-container">
        <HeaderLayout docKey={this.state.docKey} />
        <div className="error-messages"></div>
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
                <option value="agate-theme">Agate</option>
                <option value="atom-one-dark-theme">Atom Dark</option>
                <option value="androidstudio-theme">Android Studio</option>
                <option value="atelier-forest-light-theme">Atelier Light</option>
                <option value="brown-paper-theme">Brown Paper</option>
              </select>
            </div>
          </div>
        </div>
        <div className="code-document">
        <pre>
          <code dangerouslySetInnerHTML={{ __html: this.state.text }} />
        </pre>
        </div>
      </div>
    );
  }

}

export default ReadView;

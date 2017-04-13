import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { StyleStore } from '../../stores';

import {
  HelpView,
  PasteView,
  PublicListView,
  ReadView,
  SavedView,
  SettingsView,
  NotFoundView
} from '../../components/views';

class RootContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Sets a react context for props that need to be accessed in several
   * places, instead of threading them through each component.
   */
  getChildContext() {
    return {
      styleStore: new StyleStore(),
      currentPaste: {}
    }
  }

  render() {
    return (
      <Router>
          <Switch>
            <Route path="/" exact component={PasteView} />
            <Route path="/edit" component={PasteView} />
            <Route path="/help" component={HelpView} />
            <Route path="/public" component={PublicListView} />
            <Route path="/saved" component={SavedView} />
            <Route path="/settings" component={SettingsView} />
            <Route path="/404" component={NotFoundView} />
            <Route path="/:docKey" component={ReadView} />
            <Route component={NotFoundView} />
          </Switch>
      </Router>
    );
  }

}

RootContainer.childContextTypes = {
  styleStore: React.PropTypes.object,
  currentPaste: React.PropTypes.object
};

export default RootContainer;

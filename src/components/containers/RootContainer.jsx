/**
 * There could be some ambiguous routes if we're not careful. For example,
 * /settings would match /:key. This is a feature, allowing you to match
 * multiple routes if wanted. To disrupt this, we can wrap the "catch-all"
 * /:key route and look for more matches inside. If we don't match any of
 * those, it will fall to the Miss component, where we can then render the
 * fall through route for /:key. See below.
 */

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { StyleStore } from '../../stores';

import {
  HelpView,
  PasteView,
  PublicListView,
  ReadView,
  SettingsView,
  NotFoundView
} from 'components/views';

class RootContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  getChildContext() {
    return {
      styleStore: StyleStore,
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

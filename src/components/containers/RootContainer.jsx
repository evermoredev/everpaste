/**
 * There could be some ambiguous routes if we're not careful. For example,
 * /settings would match /:key. This is a feature, allowing you to match
 * multiple routes if wanted. To disrupt this, we can wrap the "catch-all"
 * /:key route and look for more matches inside. If we don't match any of
 * those, it will fall to the Miss component, where we can then render the
 * fall through route for /:key. See below.
 */

import React from 'react';
import { Miss, Match, BrowserRouter } from 'react-router';
import { Provider } from 'mobx-react';
import * as stores from 'stores/';

import { StandardLayout } from 'components/layouts';
import MatchRoute from 'core/modules/match_route';

import {
  HelpView,
  PasteView,
  PublicListView,
  ReadView,
  SettingsView,
  NotFoundView
} from 'components/views';

class RootContainer extends React.Component {

  static displayName = 'RootContainer';

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider {...stores}>
        <BrowserRouter>
          <div>
            <MatchRoute pattern="/" layout={StandardLayout} component={PasteView} exactly={true} />
            <Match pattern="/:key" render={(matchProps) => (
              <div>
                <MatchRoute pattern="/settings" layout={StandardLayout} component={SettingsView} />
                <MatchRoute pattern="/list" layout={StandardLayout} component={PublicListView} />
                <MatchRoute pattern="/help" layout={StandardLayout} component={HelpView} />
                <MatchRoute pattern="/:key" layout={StandardLayout} component={ReadView} />
              </div>
            )} />
            <Match pattern="/edit/:key" component={PasteView} />
            {/*<MatchRoute layout={StandardLayout} component={NotFoundView} />*/}
          </div>
        </BrowserRouter>
      </Provider>
    );
  }

}

export default RootContainer;

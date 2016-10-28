import React from 'react';
import { Miss, Match, BrowserRouter } from 'react-router';
import { Provider } from 'mobx-react';
import * as stores from 'stores/';

import LayoutContainer from '../LayoutContainer/LayoutContainer.jsx';
import{ PasteView, ReadView, SettingsView, NotFoundView } from 'components/views';

class RootContainer extends React.Component {

  static displayName = 'RootContainer';

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <Provider {...stores}>
        <BrowserRouter>
          <LayoutContainer>
            <Match pattern="/" component={PasteView} exactly={true} />
            <Match pattern="/settings" component={SettingsView} />
            <Match pattern="/:key" component={ReadView} />
            <Match pattern="/edit/:key" component={PasteView} />
            <Miss component={NotFoundView} />
          </LayoutContainer>
        </BrowserRouter>
      </Provider>
    );
  }

}

export default RootContainer;

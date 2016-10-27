import React from 'react';
import { Miss, Match, BrowserRouter } from 'react-router';
import { Provider } from 'mobx-react';
import * as stores from 'stores/';

import LayoutContainer from 'components/containers/LayoutContainer';
import PasteView from 'components/views/PasteView';
import ReadView from 'components/views/ReadView';
import NotFoundView from 'components/views/NotFoundView';

class RootContainer extends React.Component {

  static displayName = 'RootContainer';

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <Provider store={stores}>
        <BrowserRouter>
          <LayoutContainer>
            <Match pattern="/" component={PasteView} exactly={true} />
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

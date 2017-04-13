import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'react-hot-loader/patch';

import { RootContainer } from './components/containers';
import './styles/main.scss';

// Grab the root element
const rootEl = document.getElementById('root');

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );

render(RootContainer);

// For hot reloading
if (module.hot)
  module.hot.accept('./components/containers/RootContainer.jsx',
    () => render(RootContainer));

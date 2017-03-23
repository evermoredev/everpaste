import './styles/main.scss';
import 'react-hot-loader/patch';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { RootContainer } from './components/containers';

const rootEl = document.getElementById('root');
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );

render(RootContainer);
if (module.hot)
  module.hot.accept('./components/containers/RootContainer.jsx',
    () => render(RootContainer));
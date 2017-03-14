import './styles/main.scss';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { RootContainer } from './components/containers';

// Initial Render
render(
  <AppContainer>
    <RootContainer />
  </AppContainer>,
  document.getElementById('root')
);

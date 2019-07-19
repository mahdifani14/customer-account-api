import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './App';
import {configureStore} from './store';
import {fromJS} from 'immutable';
import build from './api/build'

// Initialize store
export const api = build();
const store = configureStore(api, fromJS(window.__INITIAL_STATE__));

const mountApp = document.getElementById('root');

render(
  <AppContainer>
    <App store={store}/>
  </AppContainer>,
  mountApp
);

/**
 * Root Component
 */
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

// Get Browser History
import browserHistory from './history';

// Import Routes
import routes from './routes';

// Material-ui theme injector
import muiTheme from './muiTheme';
import { MuiThemeProvider } from '@material-ui/core/styles';

// Base stylesheet
require('flexboxgrid');
require('./main.css');

export default function App(props) {
  return (
    <Provider store={props.store}>
      <MuiThemeProvider muiTheme={muiTheme}>
          <Router history={browserHistory()}>
            {routes}
          </Router>
      </MuiThemeProvider>
    </Provider>
  );
}

App.propTypes = {
  store: React.PropTypes.object.isRequired,
};

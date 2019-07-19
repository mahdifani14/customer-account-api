/**
 * Main store function
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { Map } from 'immutable';

export function configureStore(api, initialState = Map()) { // eslint-disable-line
  // Middleware and store enhancers
  const enhancers = [
    applyMiddleware(thunk.withExtraArgument(api)),
  ];

  return createStore(rootReducer, initialState, compose(...enhancers));
}

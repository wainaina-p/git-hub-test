import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import resetEnhancer from '../enhancer/reset';
import { routerReducer } from 'react-router-redux';
import { reducer as loadingReducer } from '../components/loading';
import { reducer as themeReducer, i18nReducer } from '../components/i18n';
// import { reducer as authReducer } from '../pages/auth/reducer';

import { changeAppTheme, i18nInit } from '../components/i18n/actions';
import * as LocalStorage from '../util/localstorage';
// import rootReducer from './RootReducer';

const originalReducers = {
  loading: loadingReducer,
  routing: routerReducer,
  theming: themeReducer,
  i18ning: i18nReducer,
  // auth: authReducer,
};
const reducer = combineReducers(originalReducers);

const win = window;
const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(require('redux-immutable-state-invariant').default());
}

const storeEnhancers = compose(
  resetEnhancer,
  applyMiddleware(...middlewares),
  win && win.devToolsExtension ? win.devToolsExtension() : (f) => f
);

const initialState = {};
const store = createStore(reducer, initialState, storeEnhancers);
store._reducers = originalReducers;
const currentTheme = LocalStorage.get('proivder_api_skin') || 'light';
store.dispatch(changeAppTheme(currentTheme));
store.dispatch(i18nInit());
export default store;

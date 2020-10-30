import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root/root';
import store, { history } from './data/state/store';
import firebase from 'firebase/app'
import firebaseConfig from './firebaseConfig'

firebase.initializeApp(firebaseConfig)

ReactDOM.render(
  <React.StrictMode>
    <Root store={store} history={history} />
  </React.StrictMode>,
  document.getElementById('root')
);
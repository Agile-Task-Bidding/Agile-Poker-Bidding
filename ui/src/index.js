import React from 'react'
import ReactDOM from 'react-dom'
import Root from './root/root'
import store, { history } from './data/state/store'
import { Provider } from 'react-redux'
import firebase from 'firebase'
//import FirebaseProvider from './firebase/firebase'
import config from './firebaseConfig'

firebase.initializeApp(config)
ReactDOM.render(
  <React.StrictMode>
    <Root store={store} history={history} />
  </React.StrictMode>,
  document.getElementById('root')
)

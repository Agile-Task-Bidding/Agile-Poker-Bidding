import React, { Component } from 'react'
import 'fontsource-roboto'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router/immutable'
import routes from './routes'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from 'firebase/app'
import { firebaseConfig } from '../firebaseConfig'
import { SnackbarProvider } from 'notistack';

const font = "'Reem Kufi', sans-serif"

const firebaseApp = firebase.initializeApp(firebaseConfig)

const firebaseAppAuth = firebaseApp.auth()
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
}

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7FBAF7',
      main: '#2b84ed',
      dark: '#223496',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#fff',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: font,
  },
})
class Root extends Component {
  render() {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <Router>
              <ConnectedRouter history={history}>{routes}</ConnectedRouter>
            </Router>
          </SnackbarProvider>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(Root)

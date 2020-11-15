import React, { Component } from 'react';
import 'fontsource-roboto';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import routes from './routes';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
const font = "'Reem Kufi', sans-serif"

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
        const { store, history } = this.props;
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <Router>
                        <ConnectedRouter history={history}>
                            {routes}
                        </ConnectedRouter>
                    </Router>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default Root;

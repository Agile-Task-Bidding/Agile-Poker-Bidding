import React, { useState } from 'react'
import logo from '../components/icon/logo.svg'
import './Home.css'
import { Home } from '../components/home/index'
import { AppProvider } from '../components/home/context'
import { createMuiTheme } from '@material-ui/core/styles'
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

class HomePage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className='App'>
          <div className='radiant-background'>
            <div className='login'>
              <div className='container'>
                <Home />
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default HomePage

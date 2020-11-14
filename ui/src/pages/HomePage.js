import React, { useState } from 'react'
import logo from '../components/icon/logo.svg'
import './Home.css'
import { Home } from '../components/home/index'
import { AppProvider } from '../components/home/context'
import { makeStyles } from '@material-ui/core/styles'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='App'>
        <div className='radiant-background'>
          <div className='login'>
            <div className='container'>
              <Home />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomePage

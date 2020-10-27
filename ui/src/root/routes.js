import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginRegisterPage from '../pages/LoginRegisterPage'

export default (
  <Switch>
    <Route exact path='/' component={HomePage} />
    <Route exact path='/login' component={LoginRegisterPage} />
  </Switch>
)

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginRegisterPage from '../pages/LoginRegisterPage'
import DemoPage from '../pages/DemoPage'
import CreatePage from '../pages/CreatePage'
import RoundPage from '../pages/RoundPage'
import VerifyLinkPage from '../pages/VerifyLinkPage'

export default (
  <Switch>
    <Route exact path='/' component={HomePage} />
    <Route exact path='/demo' component={DemoPage} />
    <Route exact path='/login' component={LoginRegisterPage} />
    <Route exact path='/home' component={HomePage} />
    <Route exact path='/create' component={CreatePage} />
    <Route exact path='/room/:username' component={RoundPage} />
    <Route exact path='/verifyemail' component={VerifyLinkPage} />
  </Switch>
)

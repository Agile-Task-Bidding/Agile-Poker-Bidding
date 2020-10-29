import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import CreatePage from '../pages/CreatePage'

export default (
  <Switch>
    <Route exact path='/' component={HomePage} />
    <Route exact path='/create' component={CreatePage} />
  </Switch>
)

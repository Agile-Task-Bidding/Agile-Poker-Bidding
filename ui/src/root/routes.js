import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import DemoPage from '../pages/DemoPage';

export default (
  <Switch>
    <Route exact path='/home' component={HomePage} />
    <Route exact path='/demo' component={DemoPage} />
  </Switch>
)

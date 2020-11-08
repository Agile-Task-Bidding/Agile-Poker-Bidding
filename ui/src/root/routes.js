import React from 'react';
import{ Redirect, Route, Switch } from 'react-router-dom';
import DemoPage from '../pages/DemoPage';

export default (
    <Switch>
        <Route
            exact
            path='/'
            component={DemoPage}
        />
    </Switch>
);
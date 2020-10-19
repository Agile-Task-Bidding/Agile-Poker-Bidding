import React from 'react';
import{ Redirect, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';

export default (
    <Switch>
        <Route
            exact
            path='/'
            component={HomePage}
        />
    </Switch>
);
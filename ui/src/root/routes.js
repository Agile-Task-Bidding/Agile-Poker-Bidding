import React from 'react';
import{ Redirect, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CreatePage from '../pages/create/CreatePage';
import RoundPage from '../pages/round/RoundPage';

export default (
    <Switch>
        <Route
            exact
            path='/'
            component={HomePage}
        />
        <Route
            exact
            path='/create'
            component={CreatePage}
        />
        <Route
            exact
            path='/room/:username'
            component={RoundPage}
        />
    </Switch>
);
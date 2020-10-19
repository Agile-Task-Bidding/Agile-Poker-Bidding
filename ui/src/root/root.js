import React, { Component } from 'react';
import 'fontsource-roboto';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import routes from './routes';

class Root extends Component {
    render() {
        const { store, history } = this.props;
        return (
            <Provider store={store}>
                <Router>
                    <ConnectedRouter history={history}>
                        {routes}
                    </ConnectedRouter>
                </Router>
            </Provider>
        );
    }
}

export default Root;

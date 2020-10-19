import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {
    connectRouter,
    routerMiddleware,
} from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';
import createRootReducer from './reducer';

export const history = createHistory();

const enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history)),
);

const store = createStore(
    createRootReducer(history),
    enhancer,
);

export default store;

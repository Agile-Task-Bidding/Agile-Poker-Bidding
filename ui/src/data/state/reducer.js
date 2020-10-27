import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import globalSocket from './global-socket/global-socket.reducer';
import account from './account/account.reducer';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    globalSocket,
    account,
});

export default createRootReducer;
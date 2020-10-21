import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import globalSocket from './global-socket/global-socket.reducer';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    globalSocket,
});

export default createRootReducer;
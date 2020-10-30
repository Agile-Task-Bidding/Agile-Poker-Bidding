import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import roomService from './room-service/room-service.reducer';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    roomService,
});

export default createRootReducer;
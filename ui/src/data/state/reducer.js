import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import roomService from './room-service/room-service.reducer';
import displayName from './display-name/display-name.reducer';
import roundState from './round-state/round-state.reducer';
import roomConfig from './room-config/room-config.reducer'

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    roomService,
    displayName,
    roundState,
    roomConfig,
});

export default createRootReducer;
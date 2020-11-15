import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import roomService from './room-service/room-service.reducer';
import appData from './app-data/app-data.reducer';
import roundState from './round-state/round-state.reducer';
import roomConfig from './room-config/room-config.reducer';
import rickRolled from './rick-rolled/rick-rolled.reducer';
import account from './account/account.reducer';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    roomService,
    account,
    appData,
    roundState,
    roomConfig,
    rickRolled,
});

export default createRootReducer;
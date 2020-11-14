import * as types from '../action-types';

const initialState = {
    socket: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_ROOM_SERVICE_CONNECTION:
            return {
                ...state,
                socket: action.socket,
            };
        default:
            return state;
    }
}
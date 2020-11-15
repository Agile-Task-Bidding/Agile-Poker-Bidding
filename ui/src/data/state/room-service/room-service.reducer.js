import * as types from '../action-types';

const initialState = {
    socket: null,
    connectedToRoom: false,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_ROOM_SERVICE_CONNECTION:
            return {
                ...state,
                socket: action.socket,
            };
        case types.SET_CONNECTED_TO_ROOM:
            return {
                ...state,
                connectedToRoom: action.connectedToRoom,
            }
        default:
            return state;
    }
}
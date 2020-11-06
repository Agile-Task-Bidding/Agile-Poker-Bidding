import * as types from '../action-types';

export function setRoundState(roomConfig) {
    return (dispatch) => {
        dispatch({ type: types.SET_ROOM_CONFIG, roomConfig });
    }
}
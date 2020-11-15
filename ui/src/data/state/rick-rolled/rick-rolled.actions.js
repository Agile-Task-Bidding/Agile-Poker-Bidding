import * as types from '../action-types';

export function setRickRollPlaying(playing) {
    return (dispatch) => {
        dispatch({ type: types.SET_RICK_ROLL_PLAYING, playing });
    }
}
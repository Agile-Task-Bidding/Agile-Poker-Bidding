import * as types from '../action-types';

export function setRoundState(roundState) {
    return (dispatch) => {
        dispatch({ type: types.SET_ROUND_STATE, roundState });
    }
}
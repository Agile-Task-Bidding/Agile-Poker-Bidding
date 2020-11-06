import * as types from '../action-types';

export function setDisplayName(displayName) {
    return (dispatch) => {
        console.log({ type: types.SET_DISPLAY_NAME, displayName })
        dispatch({ type: types.SET_DISPLAY_NAME, displayName });
    }
}
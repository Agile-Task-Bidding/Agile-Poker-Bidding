import * as types from '../action-types';

export function setDisplayName(displayName) {
    return (dispatch) => {
        dispatch({ type: types.SET_DISPLAY_NAME, displayName });
    }
}

export function setAppState(appState) {
    return (dispatch) => {
        dispatch({ type: types.SET_APP_STATE, appState })
    }
}
import * as types from '../action-types';
import AppState from '../../../services/AppState';

const initialState = {
    displayName: '',
    appState: AppState.PICK_DISPLAY_NAME,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_DISPLAY_NAME:
            return {
                ...state,
                displayName: action.displayName,
            };
        case types.SET_APP_STATE:
            return {
                ...state,
                appState: action.appState
            };
        default:
            return state;
    }
}
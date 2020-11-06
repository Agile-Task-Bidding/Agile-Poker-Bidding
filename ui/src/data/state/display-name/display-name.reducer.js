import * as types from '../action-types';

const initialState = {
    displayName: ''
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_DISPLAY_NAME:
            return {
                ...state,
                displayName: action.displayName,
            };
        default:
            return state;
    }
}
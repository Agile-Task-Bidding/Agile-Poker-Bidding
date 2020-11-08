import * as types from '../action-types';

const initialState = {
    playing: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_RICK_ROLL_PLAYING:
            return {
                ...state,
                playing: action.playing,
            };
        default:
            return state;
    }
}
import * as types from '../action-types';

const initialState = {
    roundState: new Map([
        ['Tanner', 4],
        ['Ryan', 1],
        ['Kenny', 3],
    ]),
}

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_ROUND_STATE:
            return {
                ...state,
                roundState: action.roundState,
            };
        default:
            return state;
    }
}
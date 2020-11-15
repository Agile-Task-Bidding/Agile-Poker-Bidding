import * as types from '../action-types';
import GameState from '../../../services/GameState';

const initialState = {
    roundState: {
        votes: [
            {name: 'Tanner', bid: 4},
            {name: 'Ryan', bid: 4},
            {name: 'Magda', bid: 2},
            {name: 'Tanner', bid: 1},
        ],
        state: GameState.BIDDING,
    }
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
import * as types from '../action-types';
import GameState from '../../../services/GameState';

const initialState = {
    account: {
        username: 'jefrey',
        deck: [],
    }
}

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_ACCOUNT:
            return {
                ...state,
                account: action.account,
            };
        default:
            return state;
    }
}
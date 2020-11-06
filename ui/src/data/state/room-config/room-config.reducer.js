import * as types from '../action-types';

const initialState = {
    roomConfig: {
        cards: [
            { value: 3, tag: 'ez'},
            { value: 5, tag: 'yeet'},
        ],
        allowAbstain: false
    }
}

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_ROOM_CONFIG:
            return {
                ...state,
                roomConfig: action.roomConfig,
            };
        default:
            return state;
    }
}
import * as types from '../action-types';

const initialState = {
    roomConfig: {
        deck: [
            { value: 2, tag: 'ez'},
            { value: 3, tag: 'yeet'},
            { value: 5, tag: 'yeet'},
            { value: 8, tag: 'yeet'},
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
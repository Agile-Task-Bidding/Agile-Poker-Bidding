import * as types from '../action-types';

export function setAccount(account) {
    return (dispatch) => {
        dispatch({ type: types.SET_ACCOUNT, account });
    }
}
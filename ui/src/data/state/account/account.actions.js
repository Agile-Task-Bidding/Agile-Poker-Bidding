import * as types from '../action-types'

export function setAccount(account) {
  return (dispatch) => {
    console.log(account)
    dispatch({ type: types.SET_ACCOUNT, account })
  }
}

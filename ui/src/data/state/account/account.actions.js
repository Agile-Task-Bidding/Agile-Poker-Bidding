import * as types from '../action-types'
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';

export function setAccount(account) {
  return (dispatch) => {
    dispatch({ type: types.SET_ACCOUNT, account })
  }
}

export function loginUser(callback) {
  return (dispatch) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            const idToken = await firebase.auth().currentUser.getIdToken(false);
            const account = (await axios.get(`/api/v1/users/${firebase.auth().currentUser.uid}`, {
                headers: {
                'Authorization': 'Bearer ' + idToken
                }
            })).data.user;
            dispatch({ type: types.SET_ACCOUNT, account })
            callback(account);
        } else {
          dispatch({ type: types.SET_ACCOUNT, account: null })
          callback(null);
        }
    })
  }
}
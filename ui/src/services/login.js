import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import { setAccount } from '../data/state/account/account.actions';

export const loginUser = (callback) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            const idToken = await firebase.auth().currentUser.getIdToken(false);
            const account = (await axios.get(`http://localhost:80/api/v1/users/${firebase.auth().currentUser.uid}`, {
                headers: {
                'Authorization': 'Bearer ' + idToken
                }
            })).data.user;
            setAccount(account);
            callback(account);
        } else {
            callback(null);
        }
    })
}
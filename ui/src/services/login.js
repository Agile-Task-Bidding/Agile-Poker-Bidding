import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';

export const loginUser = (callback, setAccount) => {
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
            setAccount(null);
            callback(null);
        }
    })
}

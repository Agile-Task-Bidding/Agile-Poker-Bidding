import * as types from '../action-types';
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import { roomServiceSocketSelector } from '../room-service/room-service.selectors';

export function setRoundState(roomConfig) {
    return (dispatch) => {
        dispatch({ type: types.SET_ROOM_CONFIG, roomConfig });
    }
}

export function startGame(roomConfig) {
    return async (dispatch, getState) => {
        try {
            const roomServiceSocket = roomServiceSocketSelector(getState());
            const idToken = await firebase.auth().currentUser.getIdToken(false);
            const user = firebase.auth().currentUser.uid;
            axios.put(`http://localhost:80/api/v1/users/${user}/roomConfig`, { roomConfig }, {
                headers: {
                    'Authorization': 'Bearer ' + idToken
                }
            });
            roomServiceSocket.emit(
                'create_room',
                roomConfig
            );
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
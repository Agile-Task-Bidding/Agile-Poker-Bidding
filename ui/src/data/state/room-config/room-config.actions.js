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

export function saveGame(roomConfig) {
    return async (dispatch, getState) => {
        try {
            const roomServiceSocket = roomServiceSocketSelector(getState());
            const authToken = await firebase.auth().currentUser.getIdToken(false);
            const user = firebase.auth().currentUser.uid;
            saveConfig(user, authToken, roomConfig);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export function startGame(roomID, roomConfig) {
    return async (dispatch, getState) => {
        try {
            const roomServiceSocket = roomServiceSocketSelector(getState());
            const authToken = await firebase.auth().currentUser.getIdToken(false);
            const user = firebase.auth().currentUser.uid;
            saveConfig(user, authToken, roomConfig);
            createRoom(authToken, roomID, roomConfig, roomServiceSocket);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

const saveConfig = (uid, authToken, roomConfig) => {
    axios.put(`/api/v1/users/${uid}/roomConfig`, { roomConfig }, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    });
}

const createRoom = (authToken, roomID, roomConfig, roomServiceSocket) => {
    roomServiceSocket.emit(
        'create_room',
        { roomID, roomConfig, authToken }
    );
}
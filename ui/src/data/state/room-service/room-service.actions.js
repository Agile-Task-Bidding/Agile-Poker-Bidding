import * as types from '../action-types';
import io from 'socket.io-client';
import settings from '../../../config';
import { roomServiceSocketSelector } from './room-service.selectors';

export function createRoomServiceConnection() {
    return async (dispatch, getState) => {
        try {
            if (!roomServiceSocketSelector(getState())) {
                const socket = io(settings.SOCKET_URL, { path: settings.ROOM_SERVICE_SOCKET });
                socket.on('connect', () => {
                    console.log('Connected!');
                });
                socket.on('disconnect', () => {
                    console.log('Disconnected');
                });
                dispatch({ type: types.SET_ROOM_SERVICE_CONNECTION, socket });
            }
        } catch (err) {
            dispatch({ type: types.SET_ROOM_SERVICE_CONNECTION, socket: null });
            console.error(err);
            throw err;
        }
    }
}

export function joinRoom(roomID, username) {
    return async (dispatch, getState) => {
        try {
            const roomServiceSocket = roomServiceSocketSelector(getState());
            if (!roomServiceSocket) {
                console.error('You are not connected to the room service socket.');
            } else {
                roomServiceSocket.emit(
                    'join_room',
                    {
                        roomID,
                        username,
                    }
                );
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
import * as types from '../action-types';
import io from 'socket.io-client';
import settings from '../../../config';
import { roomServiceSocketSelector } from './room-service.selectors';

export function createRoomServiceConnection() {
    return async (dispatch, getState) => {
        try {
            if (!roomServiceSocketSelector(getState())) {
                console.log(settings)
                const socket = io(settings.SOCKET_URL, { path: settings.ROOM_SERVICE_SOCKET });
                socket.on('connect', () => {
                    console.log('Connected!');
                });
                socket.on('disconnect', () => {
                    console.log('Disconnected');
                });
                socket.on('error', console.log);
                socket.on('reconnect_attempt', console.log);
                socket.on('connect_error', console.log);
                socket.on('reconnecting', console.log);
                socket.on('reconnect_failed', console.log);
                dispatch({ type: types.SET_ROOM_SERVICE_CONNECTION, socket });
                return socket;
            } else {
                return roomServiceSocketSelector(getState())
            }
        } catch (err) {
            dispatch({ type: types.SET_ROOM_SERVICE_CONNECTION, socket: null });
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
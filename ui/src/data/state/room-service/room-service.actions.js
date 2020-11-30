import * as types from '../action-types';
import io from 'socket.io-client';
import settings from '../../../config';
import { roomServiceSocketSelector } from './room-service.selectors';
import AppState from '../../../services/AppState';
import { accountSelector } from '../account/account.selector';

export function createRoomServiceConnection() {
    return async (dispatch, getState) => {
        try {
            if (!roomServiceSocketSelector(getState())) {
                const socket = io(settings.SOCKET_URL, { path: settings.ROOM_SERVICE_SOCKET });
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

/**
 * Emits the specified event on to the room service socket hosted
 * on the server; eventInfo stores the JavaScript object that should
 * be sent with the event.
 */
export function emitEvent(event, eventInfo) {
    return async (dispatch, getState) => {
        try {
            const roomServiceSocket = roomServiceSocketSelector(getState());
            if (!roomServiceSocket) {
                console.error('You are not connected to the room service socket.');
            } else {
                roomServiceSocket.emit(
                    event,
                    eventInfo
                );
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
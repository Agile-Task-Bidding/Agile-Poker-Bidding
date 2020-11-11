import * as types from '../action-types';
import io from 'socket.io-client';
import settings from '../../../config';
import { roomServiceSocketSelector } from './room-service.selectors';
import AppState from '../../../services/AppState';

export function createRoomServiceConnection() {
    return async (dispatch, getState) => {
        try {
            if (!roomServiceSocketSelector(getState())) {
                const socket = io(settings.SOCKET_URL, { path: settings.ROOM_SERVICE_SOCKET });
                //TODO move this somewhere else
                socket.on('connect', () => {
                    console.log('Connected!');
                });
                socket.on('disconnect', () => {
                    console.log('Disconnected');
                    dispatch({ type: types.SET_DISPLAY_NAME, displayName: '' })
                    dispatch({ type: types.SET_CONNECTED_TO_ROOM, connectedToRoom: false })
                });
                socket.on('join_success', () => {
                    dispatch({ type: types.SET_CONNECTED_TO_ROOM, connectedToRoom: true })
                    dispatch({ type: types.SET_APP_STATE, appState: AppState.GAME })
                })
                socket.on('room_state_changed', (roundState) => {
                    dispatch({ type: types.SET_ROUND_STATE, roundState })
                });
                socket.on('vote_success', () => {
                    console.log('vote sucess');
                });
                socket.on('rickroll', () => {
                    dispatch({ type: types.SET_RICK_ROLL_PLAYING, playing: true })
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
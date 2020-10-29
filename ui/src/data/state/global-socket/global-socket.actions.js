import * as types from '../action-types'
import io from 'socket.io-client'
import settings from '../../../config'
import { globalSocketSelector } from './global-socket.selectors'

export function createGlobalSocket() {
  return async (dispatch, getState) => {
    try {
      if (!globalSocketSelector(getState())) {
        const socket = io(settings.SOCKET_URL, {
          path: settings.ROOM_SERVICE_SOCKET,
        })
        socket.on('connect', () => {
          console.log('Connected!')
          dispatch({ type: types.SET_GLOBAL_SOCKET, socket })
        })
        socket.on('disconnect', () => {
          console.log('Disconnected')
          dispatch({ type: types.SET_GLOBAL_SOCKET, socket: null })
        })
        return socket
      }
    } catch (err) {
      dispatch({ type: types.SET_GLOBAL_SOCKET, socket: null })
      console.error(err)
      throw err
    }
  }
}

import * as types from '../action-types'
import io from 'socket.io-client'
import settings from '../../../config'
import { globalSocketSelector } from './global-socket.selectors'

export function createGlobalSocket() {
  return async (dispatch, getState) => {
    try {
      if (!globalSocketSelector(getState())) {
        return new Promise((resolve, reject) => {
          const socket = io(settings.WEBSOCKET_URL, {
            origins: '*:*', //TODO probably security vulnerability
          })
          socket.on('connect', () => {
            console.log('Connected!')
            dispatch({ type: types.SET_GLOBAL_SOCKET, socket })
            resolve(socket)
          })
          socket.on('error', (err) => {
            reject(err)
          })
          socket.on('reconnect', () => console.log('reconnecting...'))
          socket.on('disconnect', () => {
            console.log('Disconnected')
            dispatch({ type: types.SET_GLOBAL_SOCKET, socket: null })
          })
        })
      }
    } catch (err) {
      dispatch({ type: types.SET_GLOBAL_SOCKET, socket: null })
      console.error(err)
      throw err
    }
  }
}

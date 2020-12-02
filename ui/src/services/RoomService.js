export const Events = {
  IS_ROOM_OPEN: 'is_room_open',
  JOIN_ROOM: 'join_room',
  CREATE_ROOM: 'create_room',
  CLOSE_ROOM: 'close_room',
  USER_VOTE: 'user_vote',
  USER_CANCEL_VOTE: 'user_cancel_vote',
  START_NEW_ROUND: 'start_new_round',
  FORCE_END_BIDDING: 'force_end_bidding',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ROOM_INACTIVE: 'room_inactive',
  ROOM_STATUS_FETCHED: 'room_status_fetched',
  HOST_CLOSED_CONNECTION: 'host_closed_connection',
  USER_ALREADY_IN_ROOM: 'user_already_in_room',
  ROOM_STATE_CHANGED: 'room_state_changed',
  JOIN_SUCCESS: 'join_success',
  NOT_IN_ROOM_ERROR: 'not_in_room_error',
  VOTE_SUCCESS: 'vote_success',
  VOTE_CANCEL_SUCCESS: 'vote_cancel_success',
  CREATE_SUCCESS: 'create_success',
  HOST_ROOM_CLOSED_FAILURE: 'host_room__closed_failure',
  HOST_ROOM_CLOSED_SUCCESS: 'host_room_closed_success',
  NOT_AUTHORIZED: 'not_authorized',
  ROOM_ALREADY_CREATED: 'room_already_created',
}

class Ticket {
  constructor(socket, event, func) {
    this.socket = socket
    this.event = event
    this.func = func
  }
  off() {
    this.socket.off(this.event, this.func)
  }
}

export function emitIsRoomOpen(socket, roomID) {
  socket.emit(Events.IS_ROOM_OPEN, { roomID })
}

export function emitJoinRoom(socket, roomID, displayName) {
  socket.emit(Events.JOIN_ROOM, {
    roomID: roomID,
    nickname: displayName,
  })
}

export function emitCreateRoom(socket, roomID, roomConfig, authToken) {
  socket.emit(Events.CREATE_ROOM, {
    roomID,
    roomConfig,
    authToken,
  })
}

export function emitCloseRoom(socket, roomID, authToken) {
  socket.emit(Events.CLOSE_ROOM, {
    roomID,
    authToken,
  })
}

export function emitUserVote(socket, roomID, cardIndex) {
  socket.emit(Events.USER_VOTE, {
    roomID,
    cardIndex,
  })
}

export function emitUserCancelVote(socket, roomID, cardIndex) {
  socket.emit(Events.USER_CANCEL_VOTE, {
    roomID,
    cardIndex,
  })
}

export function emitStartNewRound(socket, roomID, authToken) {
  socket.emit(Events.START_NEW_ROUND, {
    roomID,
    authToken,
  })
}

export function emitForceEndBidding(socket, roomID, authToken) {
  socket.emit(Events.FORCE_END_BIDDING, {
    roomID,
    authToken,
  })
}

function registerOn(socket, event, callback) {
  const ticket = new Ticket(socket, event, callback)
  socket.on(event, ticket.func)
  return ticket
}

export function onConnect(socket, callback) {
  return registerOn(socket, Events.CONNECT, (_) => callback())
}

export function onDisconnect(socket, callback) {
  return registerOn(socket, Events.DISCONNECT, (_) => callback())
}

export function onRoomStatusFetched(socket, callback) {
  return registerOn(socket, Events.ROOM_STATUS_FETCHED, (event) =>
    callback(event.status)
  )
}

export function onHostClosedConnection(socket, callback) {
  return registerOn(socket, Events.HOST_CLOSED_CONNECTION, (_) => callback())
}

export function onUserAlreadyInRoom(socket, callback) {
  return registerOn(socket, Events.USER_ALREADY_IN_ROOM, (_) => callback())
}

export function onRoomInactive(socket, callback) {
  return registerOn(socket, Events.ROOM_INACTIVE, (_) => callback())
}

export function onRoomStateChanged(socket, callback) {
  return registerOn(socket, Events.ROOM_STATE_CHANGED, (event) =>
    callback(event.roomState)
  )
}

export function onJoinSuccess(socket, callback) {
  return registerOn(socket, Events.JOIN_SUCCESS, (_) => callback())
}

export function onNotInRoomError(socket, callback) {
  return registerOn(socket, Events.NOT_IN_ROOM_ERROR, (_) => callback())
}

export function onVoteSuccess(socket, callback) {
  return registerOn(socket, Events.VOTE_SUCCESS, (_) => callback())
}

export function onVoteCancelSuccess(socket, callback) {
  return registerOn(socket, Events.VOTE_CANCEL_SUCCESS, (_) => callback())
}

export function onCreateSuccess(socket, callback) {
  return registerOn(socket, Events.CREATE_SUCCESS, (_) => callback())
}

export function onHostRoomClosedSuccess(socket, callback) {
  return registerOn(socket, Events.HOST_ROOM_CLOSED_SUCCESS, (_) => callback())
}

export function onHostRoomClosedFailure(socket, callback) {
  return registerOn(socket, Events.HOST_ROOM_CLOSED_FAILURE, (_) => callback())
}

export function onNotAuthorized(socket, callback) {
  return registerOn(socket, Events.NOT_AUTHORIZED, (_) => callback())
}

export function onRoomAlreadyCreated(socket, callback) {
  return registerOn(socket, Events.ROOM_ALREADY_CREATED, (_) => callback())
}

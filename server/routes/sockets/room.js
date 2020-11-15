const _ = require('lodash')
const Constants = require('../../constants')

class Room {
  constructor(ioRef, roomID, roomConfig) {
    // This is the reference to the io server
    this.ioRef = ioRef
    // The reference to the appropriate io room ("channel")
    this.roomID = roomID
    // The copy of the roomConfig
    this.roomConfig = { ...roomConfig }
    // The reference to the room's deck
    this.deck = this.roomConfig.deck

    // If the allowAbstain property is set, we need to add an
    // abstain option to the room's deck
    if (this.roomConfig.allowAbstain) {
      this.deck.push({
        tag: 'Abstain',
        value: Constants.ABSTAIN_VALUE,
      })
    }

    // We need to store a room state that can be passed to users
    // (especially those joining late).
    this.roomState = {
      phase: Constants.VOTING_PHASE,
      voteByUserID: {},
      connectedUsersByID: {},
      deck: this.deck,
    }
  }

  /**
   * Check if the voting phase is complete, and update the roomState if so.
   */
  checkIfVotingComplete() {
    // Check if a vote exists for each user in the list of voted users
    let allUsersVoted = true
    for (const userID in this.roomState.connectedUsersByID) {
      const voteValue = this.roomState.voteByUserID[userID]
      if (voteValue === null) {
        allUsersVoted = false
        break
      }
    }
    if (allUsersVoted) {
      this.roomState.phase = Constants.RESULTS_PHASE
    }
  }

  /**
   * Get the user from the connectedUsers array given the user's socket. Returns null
   * if the user is not in state.
   */
  getUserFromState(socket) {
    return this.roomState.connectedUsersByID[socket.id]
  }

  /**
   * Emit the specified event to everyone in the room.
   */
  emitRoomEvent(event, eventInfo) {
    this.ioRef.to(this.roomID).emit(event, eventInfo)
  }

  /**
   * Emit the specified event to the specific user from connectedUsers array.
   */
  emitUserEvent(event, user, eventInfo) {
    this.ioRef.to(user.socketID).emit(event, eventInfo)
  }

  /**
   * Disconnect a user from the room if they are already joined.
   */
  disconnectUserFromRoom(socket) {
    // Remove the user from the list of connected users.
    delete this.roomState.connectedUsersByID[socket.id]
    // Remove mention of the user's vote from the voteByUserID object
    delete this.roomState.voteByUserID[socket.id]
    // Check if the voting phase can move to the results phase now
    this.checkIfVotingComplete()
    // Emit a room_state_changed message.
    this.emitRoomEvent('room_state_changed', { roomState: this.roomState })
  }

  /**
   * Disconnect all users from the room. We don't need to worry about removing them from the
   * connectedUsers array in this class since the class will be deleted later.
   */
  disconnectAllUsers() {
    for (const userID in this.roomState.connectedUsersByID) {
      // Disconnect the user from the room channel.
      this.ioRef.sockets.sockets[userID].leave(this.roomID)
      // Emit a host_closed_connection event to the user.
      this.emitUserEvent(
        'host_closed_connection',
        this.roomState.connectedUsersByID[userID]
      )
    }
  }

  /**
   * Kick the specified user from the room.
   */
  kickUser(user) {
    // Check if the user is in the list of connectedUsers.
    const existingUser = this.getUserFromState(
      this.ioRef.sockets.sockets[user.socketID]
    )
    if (existingUser) {
      // Disconnect the user from the room channel.
      this.ioRef.sockets.sockets[existingUser.socketID].leave(this.roomID)
      // Remove the user from the list of connected users.
      delete this.roomState.connectedUsersByID[user.socketID]
      // Check if the voting phase can move to the results phase now
      this.checkIfVotingComplete()
      // Emit a room_state_changed message to everyone in the room.
      this.emitRoomEvent('room_state_changed', { roomState: this.roomState })
      // Emit a host_closed_connection event to the kicked user.
      this.emitUserEvent('host_closed_connection', existingUser)
    }
  }

  /**
   * Join a user to the room if they aren't already joined to the room.
   * The user object consists of a nickname and a socket.
   */
  joinUserToRoom(nickname, socket) {
    // Check if the user's socket is already in the list of connected users.
    const existingUser = this.getUserFromState(socket)
    if (existingUser) {
      // User is already in the list of connected users.
      this.emitUserEvent('user_already_in_room', existingUser)
    } else {
      // Store info about the connection in the connectedUsers array
      this.roomState.connectedUsersByID[socket.id] = {
        nickname,
        socketID: socket.id,
      }
      // Set the user's vote to null to signify they have not voted yet
      this.roomState.voteByUserID[socket.id] = null
      // Join the user's socket to the correct channel
      socket.join(this.roomID)
      // Emit a room_state_changed event to everyone in the room
      this.emitRoomEvent('room_state_changed', { roomState: this.roomState })
      // Emit a join_success event to the user that just joined the room
      this.emitUserEvent(
        'join_success',
        { socketID: socket.id },
        { roomState: this.roomState }
      )
    }
  }

  /**
   * Register the user's vote in the room.
   */
  userVote(cardIndex, socket) {
    // Check if the user's socket is in the list of connected users.
    const existingUser = this.getUserFromState(socket)
    if (!existingUser) {
      // Emit a not_in_room_error event to the user
      this.emitUserEvent(
        'not_in_room_error',
        { socketID: socket.id },
        { roomID }
      )
    } else {
      // Set the user's vote in the roomState
      this.roomState.voteByUserID[socket.id] = cardIndex // Check if the phase should be updated
      this.checkIfVotingComplete()
      // Emit a room_state_changed event to everyone in the room
      this.emitRoomEvent('room_state_changed', { roomState: this.roomState })
      // Emit a vote_success event to the user
      this.emitUserEvent('vote_success', existingUser)
    }
  }

  /**
   * Cancel the user's vote in the room.
   */
  userCancelVote(socket) {
    // Check if the user's socket is in the list of connected users.
    const existingUser = this.getUserFromState(socket)
    if (!existingUser) {
      // Emit a not_in_room_error event to the user
      this.emitUserEvent(
        'not_in_room_error',
        { socketID: socket.id },
        { roomID }
      )
    } else {
      // Cancel the user's vote in the roomState
      this.roomState.voteByUserID[socket.id] = null
      // Emit a room_state_changed event to everyone in the room
      this.emitRoomEvent('room_state_changed', { roomState: this.roomState })
      // Emit a vote_cancel_success event to the user
      this.emitUserEvent('vote_cancel_success', existingUser)
    }
  }

  /**
   * Start a new round of voting in the room.
   */
  startNewRound() {
    // Check if the room is in the RESULTS phase
    if (this.roomState.phase === Constants.RESULTS_PHASE) {
      // Reset the room phase
      this.roomState.phase = Constants.VOTING_PHASE
      // Reset everyone's votes
      for (const userID in this.roomState.connectedUsersByID) {
        this.roomState.voteByUserID[userID] = null
      }
      // Emit a room_state_changed event to everyone in the room
      this.emitRoomEvent('room_state_changed', { roomState: this.roomState })
    }
  }

  /**
   * Force end the bidding phase in the room and proceed to the results phase.
   */
  forceEndBidding() {
    // Check if the room is in the VOTING phase
    if (this.roomState.phase === Constants.VOTING_PHASE) {
      // Reset the room phase
      this.roomState.phase = Constants.RESULTS_PHASE
      // Emit a room_state_changed event to everyone in the room
      this.emitRoomEvent('room_state_changed', { roomState: this.roomState })
    }
  }
}

module.exports.Room = Room

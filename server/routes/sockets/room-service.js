const socketIo = require('socket.io');
const roomAPI = require('./room');
const Utils = require('../../utils').Utils;

// Set up the socket server
class RoomService {
    constructor(server, path) {
        this.io = socketIo(server, { path });
        this.io.on('connection', socket => this.onConnection(socket));
    
        this.io.listen(process.env.SOCKET_PORT);

        // Tracks the active rooms handled by the server
        this.activeRoomsByID = {};
        // Tracks the active sockets handled by the server
        this.activeSocketsByID = {};
    }

    /**
     * Emit an event to the specified socket.
     */
    emitUserEvent(event, socket, eventInfo) {
        this.io.to(socket.id).emit(event, eventInfo);
    }

    /**
     * Handle a new connection to the room service socket (not a room
     * itself).
     */
    onConnection(socket) {
        Utils.DebugLog('New Connection!');
        this.activeSocketsByID[socket.id] = { socket };
        // Handle a user disconnecting from the room service socket.
        socket.on('disconnect', () => this.onDisconnect(socket));
        // Handle a user joining the room.
        socket.on('join_room', eventInfo => this.clientJoinRoomEvent(eventInfo, socket));
        // Handle a user voting on an option.
        socket.on('user_vote', eventInfo => this.clientVoteEvent(eventInfo, socket));
        // Handle a user cancelling their vote.
        socket.on('user_cancel_vote', eventInfo => this.clientCancelVoteEvent(eventInfo, socket));
        // Handle a user creating a room. (Host)
        socket.on('create_room', eventInfo => this.clientStartRoomEvent(eventInfo, socket));
        // Handle a user closing a room. (Host)
        socket.on('close_room', eventInfo => this.clientCloseRoomEvent(eventInfo, socket));
        // Handle a user kicking another user from a room. (Host)
        socket.on('kick_user', eventInfo => this.clientKickUserEvent(eventInfo, socket));
        // Handle a user starting a new round of voting. (Host)
        socket.on('start_new_round', eventInfo => this.clientStartNewRoundEvent(eventInfo, socket));
        // Handle a user forcing the round to be over. (Host)
        socket.on('force_end_bidding', eventInfo => this.clientForceEndBidding(eventInfo, socket));
    }

    /**
     * Handle a user disconnecting from the room service socket.
     * 
     * TODO: Handle if host disconnects from active room; it should close the room in that case.
     */
    onDisconnect(socket) {
        try {
            // Remove the user from their connected room if they were in a room
            const connectedRoomID = this.activeSocketsByID[socket.id].connectedTo;
            if (
                connectedRoomID
                && this.activeRoomsByID[connectedRoomID]
            ) {
                const room = this.activeRoomsByID[connectedRoomID];
                room.disconnectUserFromRoom(socket);
            }
            // Remove the socket info from the activeSocketsByID list
            delete this.activeSocketsByID[socket.id];
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Create the room and set it in the list of active rooms by ID
     */
    createRoom(roomID, roomConfig) {
        this.activeRoomsByID[roomID] = new roomAPI.Room(this.io, roomID, roomConfig);
    }

    /**
     * Helper function to close a room
     */
    closeRoom(room) {
        // Disconnect all users from the room and send them a message.
        room.disconnectAllUsers();
        // Delete the room from the list of active rooms
        delete this.activeRoomsByID[room.roomID];
    }

    /**
     * Have the user join the correct room if it exists and is active.
     */
    clientJoinRoomEvent(eventInfo, socket) {
        if (
            !eventInfo.roomID
            || !eventInfo.nickname
        ) {
            Utils.DebugLog('Invalid event info passed to clientJoinRoomEvent.');
        } else {
            try {
                // If the specified roomID is not in the list of active rooms, we cannot join. Emit an error event.
                if (!this.activeRoomsByID[eventInfo.roomID]) {
                    this.emitUserEvent('room_inactive', socket);
                } else {
                    // Grab the correct room from the list of active rooms
                    const room = this.activeRoomsByID[eventInfo.roomID];
                    // Join the user to the room
                    room.joinUserToRoom(eventInfo.nickname, socket);
                    // Update the socket info
                    this.activeSocketsByID[socket.id].connectedTo = eventInfo.roomID;
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    /**
     * Have the user create a room if it doesn't already exist. Does not join the user to the room.
     */
    clientStartRoomEvent(eventInfo, socket) {
        if (
            !eventInfo.roomID
            || !eventInfo.roomConfig
        ) {
            Utils.DebugLog('Invalid event info passed to clientStartRoomEvent.');
        } else {
            try {
                // If the specified roomID is already in the list of active rooms, we do not want to start another. Emit an error event.
                if (this.activeRoomsByID[eventInfo.roomID]) {
                    this.emitUserEvent('room_already_created', socket);
                } else {
                    // Create the new room and store the info in the list of rooms
                    this.createRoom(eventInfo.roomID, eventInfo.roomConfig);
                    // Emit a create_success event to the host
                    this.emitUserEvent('create_success', socket);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    /**
     * Have the user close the specified room.
     */
    clientCloseRoomEvent(eventInfo, socket) {
        if (!eventInfo.roomID) {
            Utils.DebugLog('Invalid event info passed to clientCloseRoomEvent.');
        } else {
            try {
                // If the specified roomID is not in the list of active rooms, we cannot close the room. Emit an error event.
                if (!this.activeRoomsByID[eventInfo.roomID]) {
                    this.emitUserEvent('host_room_closed_failure', socket);
                } else {
                    // Grab the correct room from the list of active rooms
                    const room = this.activeRoomsByID[eventInfo.roomID];
                    // Close the room
                    this.closeRoom(room);
                    // Emit a success message
                    this.emitUserEvent('host_room_closed_success', socket);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    /**
     * Have the user kick another user from the specified room.
     */
    clientKickUserEvent(eventInfo, socket) {
        if (
            !eventInfo.roomID
            || !eventInfo.user
        ) {
            Utils.DebugLog('Invalid event info passed to clientKickUserEvent.');
        } else {
            try {
                // Make sure the room is active.
                const room = this.activeRoomsByID[eventInfo.roomID];
                if (room) {
                    // Kick the user from the room
                    room.kickUser(eventInfo.user);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    /**
     * Have the user vote in the specified room.
     */
    clientVoteEvent(eventInfo, socket) {
        if (
            !eventInfo.roomID
            || eventInfo.cardIndex === null
        ) {
            Utils.DebugLog('Invalid event info passed to clientVoteEvent.');
        } else {
            try {
                // Make sure the room is active.
                const room = this.activeRoomsByID[eventInfo.roomID];
                if (room) {
                    // Have the user vote in the room
                    room.userVote(eventInfo.cardIndex, socket);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    /**
     * Have the user cancel their vote in the specified room.
     */
    clientCancelVoteEvent(eventInfo, socket) {
        if (!eventInfo.roomID) {
            Utils.DebugLog('Invalid event info passed to clientCancelVoteEvent.');
        } else {
            try {
                // Make sure the room is active.
                const room = this.activeRoomsByID[eventInfo.roomID];
                if (room) {
                    // Cancel the user's vote in the room
                    room.userCancelVote(socket);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    /**
     * Have the user start a new round of voting in the specified room.
     */
    clientStartNewRoundEvent(eventInfo, socket) {
        if (!eventInfo.roomID) {
            Utils.DebugLog('Invalid event info passed to clientStartNewRoundEvent.');
        } else {
            try {
                // Make sure the room is active.
                const room = this.activeRoomsByID[eventInfo.roomID];
                if (room) {
                    // Start a new round of voting in the room
                    room.startNewRound();
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    /**
     * Have the user force end bidding in the specified room and proceed to the
     * results phase.
     */
    clientForceEndBidding(eventInfo, socket) {
        if (!eventInfo.roomID) {
            Utils.DebugLog('Invalid event info passed to clientForceEndBidding.');
        } else {
            try {
                // Make sure the room is active.
                const room = this.activeRoomsByID[eventInfo.roomID];
                if (room) {
                    // Force end bidding in the room
                    room.forceEndBidding();
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports.RoomService = RoomService;

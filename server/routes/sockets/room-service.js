const socketIo = require('socket.io');
const roomAPI = require('./room');
const Utils = require('../../utils');
const AuthService = require('../../services/auth');
const constants = require('../../constants');
const { valid } = require('joi');

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
     * Function to get the UID of a user given an auth token
     */
    async getUID(authToken) {
        return await AuthService.getUIDFromToken(authToken);
    }

    /**
     * Checks if the user is authorized via the server to take an action.
     */
    async checkIfUserAuthorized(authToken) {
        return authToken && await this.getUID(authToken).catch(err => false);
    }

    /**
     * Checks if the user is authorized for a room (as a host).
     */
    async checkIfUserAuthorizedForRoom(room, authToken) {
        const hostUID = room.hostUID;
        return authToken && hostUID && await AuthService.validateToken(authToken, hostUID).catch(err => false);
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
        // Handle a user attempting to fetch the status of a room.
        socket.on('is_room_open', eventInfo => this.clientIsRoomOpenEvent(eventInfo, socket));
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
     * Function to get the UID of a user given an auth token
     */
    async getUID(authToken) {
        return await AuthService.getUIDFromToken(authToken);
    }

    /**
     * Checks if the user is authorized via the server to take an action.
     */
    async checkIfUserAuthorized(authToken, socket, eventInfoOnError) {
        const validated = authToken && await this.getUID(authToken).catch(err => false);
        if (validated) {
            return true;
        } else {
            this.emitUserEvent('not_authorized', socket, eventInfoOnError);
            return false;
        }
    }

    /**
     * Checks if the user is authorized for a room (as a host).
     */
    async checkIfUserAuthorizedForRoom(room, authToken, socket, eventInfoOnError) {
        const hostUID = room.hostUID;
        const validated = authToken && hostUID && await AuthService.validateToken(authToken, hostUID).catch(err => false);
        if (validated) {
            return true;
        } else {
            this.emitUserEvent('not_authorized', socket, eventInfoOnError);
            return false;
        }
    }

    /**
     * Emit an event to the specified socket.
     */
    emitUserEvent(event, socket, eventInfo) {
        this.io.to(socket.id).emit(event, eventInfo);
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
    createRoom(roomID, roomConfig, hostUID) {
        this.activeRoomsByID[roomID] = new roomAPI.Room(this.io, roomID, roomConfig, hostUID);
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
            return;
        }
        try {
            // If the specified roomID is not in the list of active rooms, we cannot join. Emit an error event.
            if (!this.activeRoomsByID[eventInfo.roomID]) {
                this.emitUserEvent('room_inactive', socket);
            } else {
                // Construct the user object to pass to the room
                const user = {
                    nickname: eventInfo.nickname,
                    socketID: socket.id,
                }
                // Grab the correct room from the list of active rooms
                const room = this.activeRoomsByID[eventInfo.roomID];
                // Join the user to the room
                room.joinUserToRoom(user, socket);
                // Update the socket info
                this.activeSocketsByID[socket.id].connectedTo = eventInfo.roomID;
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Have the user create a room if it doesn't already exist. Does not join the user to the room.
     */
    async clientStartRoomEvent(eventInfo, socket) {
        if (
            !eventInfo.roomID
            || !eventInfo.roomConfig
        ) {
            Utils.DebugLog('Invalid event info passed to clientStartRoomEvent.');
            return;
        }
        try {
            // First we need to check if the user is authorized for this action.
            if (!await this.checkIfUserAuthorized(eventInfo.authToken)) {
                this.emitUserEvent('not_authorized', socket, {
                    'title': 'Failed to Create Room',
                    'message': 'We could not authorize your attempt to create a room.'
                });
                return;
            }
            // If the specified roomID is already in the list of active rooms, we do not want to start another. Emit an error event.
            if (this.activeRoomsByID[eventInfo.roomID]) {
                this.emitUserEvent('room_already_created', socket);
            } else {
                // Get the UID from the token to set as the room's host.
                const hostUID = await this.getUID(eventInfo.authToken);
                // Create the new room and store the info in the list of rooms
                this.createRoom(eventInfo.roomID, eventInfo.roomConfig, hostUID);
                // Emit a create_success event to the host
                this.emitUserEvent('create_success', socket);
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Have the user close the specified room.
     */
    async clientCloseRoomEvent(eventInfo, socket) {
        if (!eventInfo.roomID) {
            Utils.DebugLog('Invalid event info passed to clientCloseRoomEvent.');
            return;
        }
        try {
            // Grab the correct room from the list of active rooms
            const room = this.activeRoomsByID[eventInfo.roomID];
            // If the specified roomID is not in the list of active rooms, we cannot close the room. Emit an error event.
            if (!room) {
                this.emitUserEvent('host_room_closed_failure', socket);
                return;
            }
            // Check if the user is authorized as the host of a room.
            if (!await this.checkIfUserAuthorizedForRoom(room, eventInfo.authToken)) {
                this.emitUserEvent('not_authorized', socket, {
                    'title': 'Failed to Close Room',
                    'message': 'We could not authorize your attempt to close this room.'
                });
                return;
            }
            // If we made it to this point, we can close the specified room.
            this.closeRoom(room);
            // Emit a success message
            this.emitUserEvent('host_room_closed_success', socket);
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Have the user kick another user from the specified room.
     */
    async clientKickUserEvent(eventInfo, socket) {
        if (
            !eventInfo.roomID
            || !eventInfo.user
        ) {
            Utils.DebugLog('Invalid event info passed to clientKickUserEvent.');
            return;
        }
        try {
            // Make sure the room is active.
            const room = this.activeRoomsByID[eventInfo.roomID];
            if (!room) {
                return;
            }
            // Make sure the user is authorized to take this action
            if (!await this.checkIfUserAuthorizedForRoom(room, eventInfo.authToken)) {
                this.emitUserEvent('not_authorized', socket, {
                    'title': 'Failed to Kick User',
                    'message': 'We could not authorize your attempt to kick that user.'
                });
                return;
            }
            // If we made it to here, we can kick the user from the room
            room.kickUser(eventInfo.user);
        } catch (err) {
            console.log(err);
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
            return;
        }
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

    /**
     * Have the user cancel their vote in the specified room.
     */
    clientCancelVoteEvent(eventInfo, socket) {
        if (!eventInfo.roomID) {
            Utils.DebugLog('Invalid event info passed to clientCancelVoteEvent.');
            return;
        }
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

    /**
     * The client is attempting to see the status of a room (whether it is active or inactive).
     */
    clientIsRoomOpenEvent(eventInfo, socket) {
        if (!eventInfo.roomID) {
            Utils.DebugLog('Invalid event info passed to clientIsRoomOpenEvent.');
            return;
        }
        try {
            // See if the room is active.
            const room = this.activeRoomsByID[eventInfo.roomID];
            // Inform the user on the room's status.
            this.emitUserEvent(
                'room_status_fetched',
                socket,
                { status: room ? constants.ROOM_STATUS_ACTIVE : constants.ROOM_STATUS_INACTIVE }
            );
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Have the user start a new round of voting in the specified room.
     */
    async clientStartNewRoundEvent(eventInfo, socket) {
        if (
            !eventInfo.roomID
        ) {
            Utils.DebugLog('Invalid event info passed to clientStartNewRoundEvent.');
            return;
        }
        try {
            // Make sure the room is active.
            const room = this.activeRoomsByID[eventInfo.roomID];
            if (!room) {
                return;
            }
            // Make sure the user is authorized as the host of the room
            if (!await this.checkIfUserAuthorizedForRoom(room, eventInfo.authToken)) {
                this.emitUserEvent('not_authorized', socket, {
                    'title': 'Failed to Start New Round',
                    'message': 'We could not authorize your attempt to start a new round.'
                });
                return;
            }
            // If we made it to here, we can start a new round of voting in the room.
            room.startNewRound();
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Have the user force end bidding in the specified room and proceed to the
     * results phase.
     */
    async clientForceEndBidding(eventInfo, socket) {
        if (!eventInfo.roomID) {
            Utils.DebugLog('Invalid event info passed to clientForceEndBidding.');
            return;
        }
        try {
            // Make sure the room is active.
            const room = this.activeRoomsByID[eventInfo.roomID];
            if (!room) {
                return;
            }
            // Make sure the user is authorized as the host of the room
            if (!await this.checkIfUserAuthorizedForRoom(room, eventInfo.authToken)) {
                this.emitUserEvent('not_authorized', socket, {
                    'title': 'Failed to Force End Bidding',
                    'message': 'We could not authorize your attempt to force the bidding round to end.'
                });
                return;
            }
            // If we made it to here, we can force end bidding in the room
            room.forceEndBidding();
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports.RoomService = RoomService;

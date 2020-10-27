const _ = require('lodash');

class Room {
    constructor(ioRef, roomID) {
        // This is the reference to the io server
        this.ioRef = ioRef;
        // The reference to the appropriate io room ("channel")
        this.roomID = roomID;

        this.connectedUsers = [];
    }

    /**
     * Emit the specified event to everyone in the room.
     */
    emitRoomEvent(event, eventInfo) {
        this.ioRef.to(this.roomID).emit(event, eventInfo);
    }

    /**
     * Disconnect a user from the room if they are already joined.
     * Emit a user_disconnected event once they are disconnected.
     */
    disconnectUserFromRoom(socket) {
        // Grab the user's username before we disconnect them
        const user = _.find(this.connectedUsers, (user) => {
            return user.socket === socket;
        });
        const username = user ? user.username : 'A user';
        // Remove the user from the list of connected users.
        _.remove(this.connectedUsers, (user) => {
            return user.socket === socket;
        });
        // Emit a user disconnected message.
        this.emitRoomEvent('user_disconnected', { username });
    }

    /**
     * Join a user to the room if they aren't already joined to the room.
     * The user object consists of a username and a socket.
     * Emit a user_joined event once they are connected.
     */
    joinUserToRoom(username, socket) {
        // Check if the user is already in the list of connected users.
        if (_.find(this.connectedUsers, (user) => {
            return user.username === username;
        })) {
            // User is already in the list of connected users.
            return null;
        } else {
            // Store info about the connectionin the connectedUsers array
            this.connectedUsers.push({
                username,
                socket,
            });
            // Join the user's socket to the correct channel
            socket.join(this.roomID);
            // Emit a user_joined event to everyone in the room
            this.emitRoomEvent('user_joined', { username });
        }
    }
}

module.exports.Room = Room;
const socketIo = require('socket.io');
const roomAPI = require('./room');

// Set up the socket server
class RoomService {
    constructor(server, path) {
        this.io = socketIo(server, { path });
        this.io.on('connection', socket => this.onConnection(socket));
    
        this.io.listen(process.env.SOCKET_PORT);

        // Tracks the active rooms handled by the server
        this.activeRoomsByID = {};
        // Tracks the active sockets handled by the server
        this.activeSocketInfo = {};
    }

    /**
     * Handle a new connection to the room service socket (not a room
     * itself).
     */
    onConnection(socket) {
        console.log('New Connection!');
        this.activeSocketInfo[socket] = {};
        console.log(this.activeSocketInfo);
        // Handle a user disconnecting from the room service socket.
        socket.on('disconnect', () => this.onDisconnect(socket));
        // Handle a user joining the room. Can also be used for the host to start the room (socket logic only).
        socket.on('join_room', event => this.clientJoinRoomEvent(event, socket));
    }

    /**
     * Handle a user disconnecting from the room service socket.
     * 
     * TODO: Handle if host disconnects from active room.
     */
    onDisconnect(socket) {
        // Remove the user from their connected room if they were in a room
        const connectedRoomID = this.activeSocketInfo[socket].connectedTo;
        if (
            connectedRoomID
            && this.activeRoomsByID[connectedRoomID]
        ) {
            const room = this.activeRoomsByID[connectedRoomID];
            room.disconnectUserFromRoom(socket);
        }
    }

    /**
     * Create the room and set it in the list of active rooms by ID
     */
    createRoom(roomID) {
        this.activeRoomsByID[roomID] = new roomAPI.Room(this.io, roomID);
    }

    /**
     * Have the user join the correct room. If the room is not already created, this will create
     * the appropriate room.
     * 
     * NOTE: A separate call should be made to check if the room is active in the server before
     * calling this function.
     */
    clientJoinRoomEvent(event, socket) {
        if (
            !event.roomID
            || !event.username
        ) {
            console.log('Invalid event info passed to clientJoinRoom.');
        } else {
            // If the specified roomID is not already in the list of active rooms, create it
            if (!this.activeRoomsByID[event.roomID]) {
                this.createRoom(event.roomID);
            }
            // Grab the correct room from the list of active rooms
            const room = this.activeRoomsByID[event.roomID];
            // Join the user to the room
            room.joinUserToRoom(event.username, socket);
            // Update the socket info
            this.activeSocketInfo[socket].connectedTo = event.roomID;
        }
    }
}

module.exports.RoomService = RoomService;

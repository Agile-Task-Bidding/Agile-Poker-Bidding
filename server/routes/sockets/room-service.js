const socketIo = require('socket.io');

// Set up the socket server
class RoomService {
    constructor(server, path) {
        this.io = socketIo(server, { path });
        this.io.on('connection', socket => this.onConnection(socket));
    
        this.io.listen(process.env.SOCKET_PORT);
    }

    onConnection(socket) {
        console.log('New Connection!');
        socket.on('disconnect', () => this.onDisconnect());
        socket.on('client_info', clientInfo => this.clientInfoReceived(clientInfo));
    }

    onDisconnect() {
        console.log('Disconnected!');
    }

    clientInfoReceived(clientInfo) {
        console.log('Client Name: ' + clientInfo.name);
        console.log('Greeting: ' + clientInfo.greeting);
    }
}

module.exports.RoomService = RoomService;
const socketIo = require('socket.io')
const admin = require('firebase-admin')

// Set up the socket server
class RoomService {
  constructor(server, path) {
    this.io = socketIo(server, { origins: '*:*' })
    this.io.on('connection', (socket) => this.onConnection(socket))

    this.io.listen(process.env.SOCKET_PORT)
  }

  onConnection(socket) {
    console.log('New Connection!')
    socket.on('disconnect', () => this.onDisconnect())
    socket.on('client_info', (clientInfo) =>
      this.clientInfoReceived(clientInfo)
    )
    socket.on('start_game', (data) => this.onStartGame(data))
  }

  onDisconnect() {
    console.log('Disconnected!')
  }

  clientInfoReceived(clientInfo) {
    console.log('Client Name: ' + clientInfo.name)
    console.log('Greeting: ' + clientInfo.greeting)
  }

  // brilliant
  async killMePlz() {
    setTimeout(() => {
      if (!checkConnections()) {
        this.killMePlz()
      }
    }, 5 * 60 * 1000)
  }

  async onStartGame(data) {
    console.log(data)
    const options = JSON.parse(data)
    console.log(options)
    const decoded = await admin.auth().verifyIdToken(options.idToken)
    console.log(decoded)
  }
}

module.exports.RoomService = RoomService

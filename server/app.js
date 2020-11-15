require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');

// Initialize Firebase Admin
const admin = require('firebase-admin');
const serviceAccount = require('./config/firebase-credential.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
});

const app = express();
const server = http.createServer(app);

// Import all other sockets that are going to be used (they will automatically listen)
const roomServiceSocket = require('./routes/sockets/room-service');

// Set the app to use some libraries
app.use(cors());
app.use(express.json());

// Use the API router
app.use('/api/v1', require('./routes/api/v1/apiRouter'));

// Set up the app to use the imported sockets
const roomService = new roomServiceSocket.RoomService(server, '/sockets/room-service');

// Serve up files from the build directory
app.use(express.static(path.join(__dirname, '../ui/build')));

// The home page
app.get(/^\/(?!api).*/, function(req, res) {
    res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
});

// Listen on the specified port for traffic
app.listen(process.env.WEBSITE_PORT, function() {
    console.log('Server is running on Port: ' + process.env.WEBSITE_PORT);
});

const rl = readline.createInterface({
    input: process.stdin,
});

rl.on('line', (input) => {
    if (input === 'rickroll') {
        roomService.randomRickRoll();
    } else {
        console.log('Unknown command');
    }
})

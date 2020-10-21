const dotenv = require('dotenv');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set the app to use some libraries
app.use(cors());
app.use(bodyParser.json());

// Serve up files from the build directory
app.use(express.static(path.join(__dirname, '../ui/build')));

// The home page
app.get(/^\/(?!api).*/, function(req, res) {
    //res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Listen on the specified port for traffic
app.listen(process.env.WEBSITE_PORT, function() {
    console.log('Server is running on Port: ' + PORT);
});

// Listen for Socket.io connections
io.on('connection', (socket) => {
    console.log('New Connection!');
    socket.on('disconnect', () => {
        console.log('Disconnected!');
    })
    socket.on('client_info', (clientInfo) => {
        console.log('Client Name: ' + clientInfo.name);
        console.log('Greeting: ' + clientInfo.greeting);
    });
});

io.listen(process.env.SOCKET_PORT);
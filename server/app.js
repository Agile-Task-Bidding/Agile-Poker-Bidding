const dotenv = require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

// Import all other API's that are going to be used
const accountAPI = require('./routes/api/account');

// Import all other sockets that are going to be used (they will automatically listen)
const roomServiceSocket = require('./routes/sockets/room-service');

// Set the app to use some libraries
app.use(cors());
app.use(bodyParser.json());

// Set the app to use the imported API's
app.use('/api/account', accountAPI);

// Set up the app to use the imported sockets
new roomServiceSocket.RoomService(server, '/sockets/room-service');

// Serve up files from the build directory
console.log(__dirname);
app.use(express.static(path.join(__dirname, '../ui/build')));

// The home page
app.get(/^\/(?!api).*/, function(req, res) {
    res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
});

// Listen on the specified port for traffic
app.listen(process.env.WEBSITE_PORT, function() {
    console.log('Server is running on Port: ' + process.env.WEBSITE_PORT);
});

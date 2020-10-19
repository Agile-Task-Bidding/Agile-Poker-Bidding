const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const PORT = 80;

// Set the app to use some libraries
app.use(cors());
app.use(bodyParser.json());

// Serve up files from the build directory
app.use(express.static(path.join(__dirname, '../ui/build')));

// The home page
app.get(/^\/(?!api).*/, function(req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Listen on the specified port for traffic
app.listen(PORT, function() {
    console.log('Server is running on Port: ' + PORT);
});
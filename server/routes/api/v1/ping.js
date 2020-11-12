const router = require('express').Router();

module.exports = (req, res) => {
    console.log('Received ping from ' + req.ip);
    return res.send('pong');
};

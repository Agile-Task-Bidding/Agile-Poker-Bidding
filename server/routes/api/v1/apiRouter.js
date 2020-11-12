const authMiddleware = require('./authMiddleware');

const router = require('express').Router();

router
    .get('/users/:uid', 
        authMiddleware, 
        require('./getUser'))
    .post('/users', 
        require('./createUser'))
    .get('/users/:uid/roomConfig', 
        authMiddleware, 
        require('./getRoomConfig'))
    .put('/users/:uid/roomconfig',
        authMiddleware,
        require('./updateRoomConfig'))
    .all('/ping', require('./ping'));

module.exports = router;

const router = require('express').Router();

router
    .use(require('./postUsers'))
    .use(require('./getUsers'))
    .use(require('./getRoomConfig'))
    .use(require('./putRoomConfig'))
    .use(require('./ping'));

module.exports = router;

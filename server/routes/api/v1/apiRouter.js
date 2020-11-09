const router = require('express').Router();

router
    .use(require('./createUser'))
    .use(require('./getUser'))
    .use(require('./getRoomConfig'))
    .use(require('./updateRoomConfig'))
    .use(require('./ping'));

module.exports = router;

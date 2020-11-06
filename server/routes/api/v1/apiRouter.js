const router = require('express').Router();

router
    .use(require('./postUsers'))
    .use(require('./getUsers'))
    .use(require('./ping'));

module.exports = router;

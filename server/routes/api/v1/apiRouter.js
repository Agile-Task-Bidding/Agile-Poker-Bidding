const router = require('express').Router();

router
    .use(require('./postUsers'))
    .use(require('./ping'));

module.exports = router;

const router = require('express').Router();

router.use('/ping', (req, res) => {
    console.log('Received ping from ' + req.ip);
    res.send('pong');
});

module.exports = router;

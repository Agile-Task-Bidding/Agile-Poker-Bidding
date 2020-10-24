const express = require('express');
const router = express.Router();

/**
 * Example of a route definition.
 */
router.post('/', function(req, res, next) {
    if (
        req.body.username
        && req.body.password
    ) {
        res.json({
            'message': 'OK!'
        });
    } else {
        res.json({
            'message': 'BAD!'
        });
    }
});

module.exports = router
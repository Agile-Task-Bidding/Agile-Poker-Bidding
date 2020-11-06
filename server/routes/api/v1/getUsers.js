const admin = require('firebase-admin');
const router = require('express').Router();

/**
 * NOTE: In the future it would be a good idea to do some authentication of 
 * requests to this endpoint. We shouldn't let any client get the information 
 * related to any user.
 * 
 * Since this is a GET endpoint, we can't send the token through a body, so 
 * the next obvious way is to shove it in the header. I haven't messed with
 * request or response headers much, so the following links should have good
 * information when the time comes:
 *   - HTTP Authentication
 *     - https://tools.ietf.org/html/rfc7235
 *     - https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
 * 
 */

router.get('/users/:uid', async (req, res) => {
    const snapshot = await admin
        .firestore()
        .collection('users')
        .doc(req.params.uid)
        .get();

    if (!snapshot.exists) {
        return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ user: snapshot.data() });
});

module.exports = router;

const admin = require('firebase-admin');
const router = require('express').Router();

/**
 * Authenticates the request, ensuring the requester is allowed to modify this 
 * user's configuration
 * @param {object} token Firebase Auth token to authenticate the requester
 * @param {string} uid Firebase Auth UID for the targeted user
 * @returns {boolean} True if the token belongs to the given UID
 */
const authenticateRequest = async (token, uid) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken.uid == uid;
    } catch (e) {
        return false;
    }
}


/**
 * Request should contain a token to authenticate the put request and the new
 * roomConfig object. For now we hope the client gives us a well-formed object,
 * because checking for structural integrity makes my code look ugly
 */
router.put('/users/:uid/roomConfig', async (req, res) => {
    const { token, roomConfig } = req.body;
    if (!token || !roomConfig) {
        return res.status(400).json({ error: { message: 'Malformed request' } });
    }

    // Bail out if the requester isn't authorized
    const authenticated = await authenticateRequest(token, req.params.uid);
    if (!authenticated) {
        return res.status(403).json(
            { error: { message: 'You do not have permission to modify this user' } });
    }


    // Attempt to update this user's roomConfig
    try {
        await admin
            .firestore()
            .collection('users')
            .doc(req.params.uid)
            .update('roomConfig', roomConfig);
    } catch (e) {
        return res.status(500).json({ error: { message: e.message } })
    }

    // Query the DB for the updated document to show the change was successful
    const snapshot = await admin
        .firestore()
        .collection('users')
        .doc(req.params.uid)
        .get();

    return res.json({ roomConfig: snapshot.data().roomConfig });
});

module.exports = router;

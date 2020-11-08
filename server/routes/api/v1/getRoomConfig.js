const admin = require('firebase-admin');
const router = require('express').Router();

/**
 * This endpoint may also benefit from some form of GET authentication
 */

router.get('/users/:uid/roomConfig', async (req, res) => {
    const snapshot = await admin
        .firestore()
        .collection('users')
        .doc(req.params.uid)
        .get();

    if (!snapshot.exists) {
        return res.status(404).json({ error: { message: 'User not found' } });
    }

    const roomConfig = snapshot.data().roomConfig;

    res.json({ roomConfig });
});

module.exports = router;

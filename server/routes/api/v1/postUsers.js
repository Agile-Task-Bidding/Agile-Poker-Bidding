const admin = require('firebase-admin');
const router = require('express').Router();

// This default config can be here for now, until we need it elsewhere
const defaultRoomConfig = {
    allowAbstain: true,
    deck: [
        {
            tag: 'Very Easy',
            value: 1
        },
        {
            tag: 'Easy',
            value: 2
        },
        {
            tag: 'Medium',
            value: 3
        },
        {
            tag: 'Difficult',
            value: 5
        },
        {
            tag: 'Hard',
            value: 8
        },
        {
            tag: 'Legendary',
            value: 13
        }
    ]
};

/**
 * Checks if the given username is taken in the users collection in the DB.
 * @param {string} username 
 * @returns {boolean}
 */
const isUsernameTaken = async (username) => {
    const usersWithThisUsername = await admin.firestore()
        .collection('users')
        .where('username', '==', username)
        .get()
    return !usersWithThisUsername.empty;
}

/**
 * Creates an account on Firebase Auth with the given information.
 * @param {string} username Desired username
 * @param {string} email Email to associate with the account
 * @param {string} password 
 * @returns A Firebase Auth user object
 */
const createUser = async (username, email, password) => {
    return await admin.auth().createUser({
        displayName: username,
        email,
        password
    });
}

/**
 * Adds a new document to the users collection corresponding to the given uid and username.
 * @param {string} uid The user id of the associated Firebase Auth user
 * @param {string} username Username of the new user
 * @param {object} roomConfig Initial room configuration for the new user
 */
const addUserDocument = async (uid, username, roomConfig) => {
    await admin.firestore()
        .collection('users')
        .doc(uid)
        .set({
            username,
            roomConfig
        });
}

/**
 * Request should contain username, email, and password
 */
router.post('/users', async (req, res) => {
    // Make sure it's well-formed (field validation should be done on client)
    const { username, email, password } = req.body;
    if (!req.body || !username || !email || !password) {
        return res.status(400).json({ error: { message: 'Malformed request' } });
    }

    try {
        // Query the user collection to ensure username uniqueness
        if (await isUsernameTaken(username)) {
            // Response status 409 = Conflict
            return res.status(409).json({ error: { message: 'Username already taken' } });
        }

        // Attempt to create the user
        const userRecord = await createUser(username, email, password);
        addUserDocument(userRecord.uid, username, defaultRoomConfig);

        console.log(`Created user: ${username}, uid: ${userRecord.uid}`);

        // Respond to the user with a custom credential that they can use to sign in
        const customToken = await admin.auth().createCustomToken(userRecord.uid);

        return res.json({
            message: "Account created successfully",
            token: customToken
        });
    } catch (e) {
        if (e.code == 'auth/email-already-exists') {
            return res.status(409).json({ error: { message: 'That email is already taken' } });
        }

        // There was a server error
        console.error(e);
        // I imagine a production app may not want to expose this error to external users
        return res.status(500).json({ error: { message: e.message } });
    }
});

module.exports = router;

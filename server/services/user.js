const admin = require('firebase-admin');
const defaultRoomConfig = require('../models/defaultRoomConfig');
const AuthService = require('./auth');

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

const UserService = {
    getUser: async (uid) => {
        const snapshot = await admin
            .firestore()
            .collection('users')
            .doc(uid)
            .get();

        if (!snapshot.exists) {
            const error = new Error('User not found');
            error.name = 'apb/user/not-found';
            throw error;
        }

        return snapshot.data();
    },

    isUsernameTaken: async (username) => {
        const usersWithThisUsername = await admin.firestore()
            .collection('users')
            .where('username', '==', username)
            .get();

        return !usersWithThisUsername.empty
    },

    // Creates a user in both the database and auth service, then returns its uid
    createUser: async (username, email, password) => {
        if (await UserService.isUsernameTaken(username)) {
            const error = new Error('Username already taken');
            error.name = 'apb/user/username-taken';
            throw error;
        }
        const user = await AuthService.createUser(username, email, password);
        await addUserDocument(user.uid, username, defaultRoomConfig);
        return user.uid;
    },

    deleteUser: async (uid) => {
        AuthService.deleteUser(uid);
        return await admin.firestore().collection('users').doc(uid).delete(); 
    },

    updateRoomConfig: async (uid, roomConfig) => {
        await admin.firestore()
            .collection('users')
            .doc(uid)
            .update('roomConfig', roomConfig);  
    }
}

module.exports = UserService;

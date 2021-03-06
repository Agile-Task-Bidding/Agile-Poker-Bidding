const admin = require('firebase-admin');

const AuthService = {
    // Returns true if the token belongs to the user identified by uid
    validateToken: async (token, uid) => {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken.uid === uid;
        } catch (e) {
            console.error('AuthService Error: ' + e.message);
            const error = new Error('Unable to validate the given token');
            error.name = 'apb/auth/service-error';
            throw error;
        }
    },

    createUser: async (username, email, password) => {
        return await admin.auth().createUser({
            displayName: username,
            email,
            password
        });
    },

    deleteUser: async (uid) => {
        return await admin.auth().deleteUser(uid);
    },

    createToken: async (uid) => {
        return await admin.auth().createCustomToken(uid);
    },

    getUIDFromToken: async (token) => {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken.uid;
        } catch (e) {
            console.error('AuthService Error: ' + e.message);
            const error = new Error('Unable to fetch the uid from the given token');
            error.name = 'apb/auth/service-error';
            throw error;
        }
    }
}

module.exports = AuthService;

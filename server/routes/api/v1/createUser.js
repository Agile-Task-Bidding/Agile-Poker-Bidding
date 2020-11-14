const Joi = require('joi');
const UserService = require('../../../services/user');
const AuthService = require('../../../services/auth');

// Request body schema
const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(16)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .required()
});

module.exports = async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) {
        // Return only the first error, for a simple response
        return res.status(400).json({
            error: { message: error.details[0].message }
        });
    }
    const { username, email, password } = req.body;

    let uid;
    try {
        uid = await UserService.createUser(username, email, password);
    } catch (e) {
        if (e.name === 'apb/user/username-taken') {
            return res.status(409).json({
                error: { message: 'That username is already taken' }
            });
        }
        if (e.code === 'auth/email-already-exists') {
            return res.status(409).json({
                error: { message: 'That email is already taken' }
            });
        }
        if (e.code === 'auth/invalid-email' || e.code === 'auth/invalid-password') {
            return res.status(400).json({
                error: { message: e.message }
            });
        }
        throw e;
    }

    console.log(`Created user: ${username}, uid: ${uid}`);

    const token = await AuthService.createToken(uid);

    return res.json({
        message: "Account created successfully",
        token
    });
};

const AuthService = require('../../../services/auth');

const UNAUTHORIZED_MESSAGE = 'You are not authorized to perform this action';

// Validates the HTTP Authorization Bearer header value
const validateHeader = (authHeader) => {
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return false;
    }

    const type = parts[0];
    if (type !== 'Bearer') {
        return false;
    }

    return true;
}

// Extracts the token from the Bearer Authorization header assuming the header
// is valid.
const extractToken = (authHeader) => {
    return authHeader.split(' ')[1];
}

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!validateHeader(authHeader)) {
        return res.status(401).json({
            error: { message: UNAUTHORIZED_MESSAGE }
        });
    }

    const uid = req.params.uid;
    const token = extractToken(authHeader);
    try {
        const tokenIsValid = await AuthService.validateToken(token, uid);
        if (!tokenIsValid) {
            return res.status(401).json({
                error: { message: UNAUTHORIZED_MESSAGE }
            });
        }
    } catch (e) {
        if (e.name === 'apb/auth/service-error') {
            return res.status(400).json({
                error: { message: e.message }
            });
        }
        throw e;
    }

    next();
}

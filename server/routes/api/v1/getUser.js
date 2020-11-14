const UserService = require('../../../services/user');

module.exports = async (req, res) => {
    const uid = req.params.uid;

    let user;
    try {
        user = await UserService.getUser(uid);
    } catch (e) {
        if (e.name === 'apb/user/not-found') {
            return res.status(404).json({ error: { message: e.message } });
        }
        throw e;
    }
    
    return res.json({ user });
};

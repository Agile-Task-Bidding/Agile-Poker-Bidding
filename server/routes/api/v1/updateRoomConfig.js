const roomConfigSchema = require('../../../models/roomConfig');
const RoomService = require('../../../services/user');


module.exports = async (req, res) => {
    const { roomConfig } = req.body;
    const { error } = roomConfigSchema.validate(roomConfig);
    if (error) {
        return res.status(400).json({
            error: { message: error.details[0].message }
        });
    }
    const uid = req.params.uid;

    await RoomService.updateRoomConfig(uid, roomConfig);

    // Query the DB for the updated document to show the change was successful
    const user = await RoomService.getUser(uid);

    return res.json({ roomConfig: user.roomConfig });
};

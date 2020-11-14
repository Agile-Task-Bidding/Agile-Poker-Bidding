const Joi = require('joi');
const roomConfigSchema = require('./roomConfig');

module.exports = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(16)
        .required(),
    
    roomConfig: roomConfigSchema.required()
});

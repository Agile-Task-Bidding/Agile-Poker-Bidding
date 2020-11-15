const Joi = require('joi');

module.exports = Joi.object({ 
    tag: Joi.string()
        .max(12),

    value: Joi.number()
        .required()
});

const Joi = require('joi');
const deckSchema = require('./deck');

module.exports = Joi.object({
    allowAbstain: Joi.boolean()
        .required(),
    deck: deckSchema.required()
});

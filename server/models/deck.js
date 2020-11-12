const Joi = require('joi');
const cardSchema = require('./card');

module.exports = Joi.array()
    .items(cardSchema)
    .required();

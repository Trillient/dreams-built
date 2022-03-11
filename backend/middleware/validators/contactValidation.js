const { body } = require('express-validator');

const contactSchema = [body('email', 'Must enter a valid email').exists().trim().normalizeEmail().isEmail(), body('name', 'Must enter a Name').exists().trim().isString(), body('message', 'Must enter a Message').exists().trim().isString()];

module.exports = { contactSchema };

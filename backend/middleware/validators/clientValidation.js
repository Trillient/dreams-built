const { body } = require('express-validator');

const clientSchema = [
  body('clientName').exists({ checkFalsy: true }).isString().withMessage('Client must be a string'),
  body('color').isString().isHexColor().withMessage('color must be entered as a Hex value'),
  body('contact').isObject().withMessage('Contact must be an object'),
  body('contact.email').trim().isEmail().withMessage('Must enter a valid email'),
  body('contact.name').isString().withMessage('Contact name must be valid'),
];

module.exports = { clientSchema };

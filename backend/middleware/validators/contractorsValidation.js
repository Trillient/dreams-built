const { body, param } = require('express-validator');

const contractorSchema = [
  body('contractor', 'Contractor Invalid').exists().isString(),
  body('contact', 'Contact Invalid').optional({ checkFalsy: true }).isString(),
  body('email', 'Email invalid').optional({ checkFalsy: true }).normalizeEmail().isEmail(),
  body('phone', 'Phone invalid').optional({ checkFalsy: true }).isString(),
];

const contractorParams = [param('id').exists().isMongoId().withMessage('Invalid contractor')];

module.exports = { contractorSchema, contractorParams };

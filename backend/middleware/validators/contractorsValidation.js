const { body, param } = require('express-validator');

const contractorSchema = [
  body('contractor', 'Contractor Invalid').exists().isString().trim(),
  body('contact', 'Contact Invalid').optional({ checkFalsy: true }).isString().trim(),
  body('email', 'Email invalid').optional({ checkFalsy: true }).trim().normalizeEmail().isEmail(),
  body('phone', 'Phone invalid').optional({ checkFalsy: true }).isString(),
];

const contractorParams = [param('id').exists().isMongoId().withMessage('Invalid contractor')];

module.exports = { contractorSchema, contractorParams };

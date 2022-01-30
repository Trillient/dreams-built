const { body, param } = require('express-validator');

const contractorSchema = [
  body('contractor', 'Contractor Invalid').exists().isString(),
  body('contact', 'Contact Invalid').optional().isString(),
  body('email', 'Email invalid').optional().normalizeEmail().isEmail(),
  body('phone', 'Phone invalid').optional().isString(),
];

const contractorParams = [param('id').exists().isMongoId().withMessage('Invalid contractor')];

module.exports = { contractorSchema, contractorParams };

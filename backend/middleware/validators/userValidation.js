const { body, param } = require('express-validator');
const User = require('../../models/userModel');

const userSchema = [
  body('userId', 'userId required').exists().isString(),
  body('firstName', 'First Name must be valid').optional().isString(),
  body('lastName', 'Last Name must be valid').optional().isString(),
  body('auth0Email', 'Must enter a valid email').exists().normalizeEmail().isEmail(),
];

const userUpdateSchema = [body('firstName', 'First Name must be valid').optional().isString(), body('lastName', 'Last Name must be valid').optional().isString(), body('auth0Email', 'Must enter a valid email').exists().normalizeEmail().isEmail()];

const userAdminUpdateSchema = [body('hourlyRate', 'Hourly Rate must be a valid number').optional().isFloat({ min: 0 })];

const userParams = [param('id').exists().isMongoId().withMessage('Invalid user')];

module.exports = { userParams, userSchema, userUpdateSchema, userAdminUpdateSchema };

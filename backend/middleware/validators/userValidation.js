const { body, param, query } = require('express-validator');

const userSchema = [
  body('userId', 'userId required').exists().isString(),
  body('firstName', 'First Name must be valid').optional().isString().trim(),
  body('lastName', 'Last Name must be valid').optional().isString().trim(),
  body('auth0Email', 'Must enter a valid email').optional({ checkFalsy: true }).normalizeEmail().isEmail(),
];

const userUpdateSchema = [
  body('firstName', 'First Name must be valid').optional().isString().trim(),
  body('lastName', 'Last Name must be valid').optional().isString().trim(),
  body('auth0Email', 'Must enter a valid email').optional().normalizeEmail().isEmail(),
];

const userAdminUpdateSchema = [body('hourlyRate', 'Hourly Rate must be a valid number').optional().isFloat({ min: 0 })];

const userParams = [param('id').exists().isMongoId().withMessage('Invalid user')];

const updateUserRole = [
  query('role', 'Role not valid')
    .exists()
    .custom((value) => {
      return value === 'employee' || value === 'admin';
    }),
];

module.exports = { userParams, userSchema, userUpdateSchema, userAdminUpdateSchema, updateUserRole };

const { param, body, query } = require('express-validator');
const { DateTime } = require('luxon');

const dueDateFullSchema = [
  body('dueDate', 'Due date must be valid (yyyy-MM-dd)')
    .optional()
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'yyyy-MM-dd');
      return dt.isValid;
    }),
  body('contractor', 'contractor field must be valid').optional().isObject(),
  body('contractor.contact', 'contact invalid').optional().isString(),
  body('contractor.email', 'invalid email').optional().normalizeEmail().isEmail(),
  body('contractor.phone', 'invalid phone').optional().isMobilePhone(),
];

const dueDatePartialSchema = [
  body('dueDate', 'Due date must be valid (yyyy-MM-dd)')
    .optional()
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'yyyy-MM-dd');
      return dt.isValid;
    }),
];

const dueDateQuerySchema = [
  query('rangeEnd', 'Invalid query parameters')
    .exists()
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'yyyy-MM-dd');
      return dt.isValid;
    }),
  query('rangeStart', 'Invalid query parameters')
    .exists()
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'yyyy-MM-dd');
      return dt.isValid;
    }),
];

const dueDatePatchSchema = [body('scheduleShift', 'Shift must be valid').exists().isInt({ min: -365, max: 365 })];

const dueDateJobIdParams = [param('jobid').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid jobid parameter')];
const dueDatePartIdQueryParams = [query('partid').exists().withMessage('Missing Job Part Title').isMongoId().withMessage('Job Part must be valid')];

const dueDateIdParams = [param('id').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid id parameter')];

module.exports = { dueDateFullSchema, dueDatePartialSchema, dueDatePatchSchema, dueDateQuerySchema, dueDateIdParams, dueDateJobIdParams, dueDatePartIdQueryParams };

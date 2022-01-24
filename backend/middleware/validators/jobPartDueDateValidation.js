const { param, body, query } = require('express-validator');
const { DateTime } = require('luxon');

const dueDateCreateSchema = [
  body('dueDate', 'Due date must be valid').optional().isString(),
  body('contractor', 'contractor field must be valid').optional().isObject(),
  body('contractor.contact', 'contact invalid').optional().isString(),
  body('contractor.phone', 'invalid phone').optional().isMobilePhone(),
  body('contractor.email', 'invalid email').optional().normalizeEmail().isEmail(),
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

const dueDatePatchSchema = [body('scheduleShift', 'Shift must be valid').exists().isInt()];

const dueDateJobIdParams = [param('jobid').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid jobid parameter')];
const dueDatePartIdQueryParams = [query('partid').exists().withMessage('Missing Job Part Title').isMongoId().withMessage('Job Part must be valid')];

const dueDateIdParams = [param('id').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid id parameter')];

module.exports = { dueDateCreateSchema, dueDatePatchSchema, dueDateQuerySchema, dueDateIdParams, dueDateJobIdParams, dueDatePartIdQueryParams };

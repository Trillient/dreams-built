const { param, body, query } = require('express-validator');
const { DateTime } = require('luxon');

const jobPartsDueDateSchema = [
  body('job').exists().withMessage('Missing Job').isMongoId().withMessage('Job must be valid'),
  body('jobPartTitle').exists().withMessage('Missing Job Part Title').isMongoId().withMessage('Job Part must be valid'),
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
      const dt = DateTime.fromFormat(value, 'yyyy/MM/dd');
      return dt.isValid;
    }),
  query('rangeStart', 'Invalid query parameters')
    .exists()
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'yyyy/MM/dd');
      return dt.isValid;
    }),
];

const dueDatePatchSchema = [body('scheduleShift', 'Shift must be valid').exists().isInt()];

const jobPartJobDueDateParams = [param('jobid').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid jobid parameter')];
const jobPartDueDateParams = [param('id').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid id parameter')];

module.exports = { jobPartsDueDateSchema, dueDatePatchSchema, dueDateQuerySchema, jobPartDueDateParams, jobPartJobDueDateParams };

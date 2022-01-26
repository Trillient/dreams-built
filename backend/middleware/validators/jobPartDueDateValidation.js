const { param, body, query } = require('express-validator');
const { DateTime } = require('luxon');

const checkDate = (value) => {
  if (value === '') {
    return true;
  }
  const dt = DateTime.fromFormat(value, 'yyyy-MM-dd');
  return dt.isValid;
};

const dueDateFullSchema = [
  body('startDate', 'Start date must be valid (yyyy-MM-dd)')
    .optional()
    .isString()
    .custom((value) => checkDate(value)),
  body('dueDate', 'Due date must be valid (yyyy-MM-dd)')
    .optional()
    .isString()
    .custom((value) => checkDate(value)),
  body('contractors.*', 'contractors field must be valid').optional().isMongoId(),
];

const dueDatePartialSchema = [
  body('startDate', 'Start date must be valid (yyyy-MM-dd)')
    .optional()
    .isString()
    .custom((value) => checkDate(value)),
  body('dueDate', 'Due date must be valid (yyyy-MM-dd)')
    .optional()
    .isString()
    .custom((value) => checkDate(value)),
];

const dueDateQuerySchema = [
  query('rangeEnd', 'Invalid query parameters')
    .exists()
    .isString()
    .custom((value) => checkDate(value)),
  query('rangeStart', 'Invalid query parameters')
    .exists()
    .isString()
    .custom((value) => checkDate(value)),
];

const shiftPatchSchema = [body('scheduleShift', 'Shift must be valid').exists().isInt({ min: -365, max: 365 })];

const dueDateJobIdParams = [param('jobid').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid jobid parameter')];
const dueDatePartIdQueryParams = [query('partid').exists().withMessage('Missing Job Part Title').isMongoId().withMessage('Job Part must be valid')];

const dueDateIdParams = [param('id').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid id parameter')];

module.exports = { dueDateFullSchema, dueDatePartialSchema, shiftPatchSchema, dueDateQuerySchema, dueDateIdParams, dueDateJobIdParams, dueDatePartIdQueryParams };

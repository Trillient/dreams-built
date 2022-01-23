const { param, body } = require('express-validator');

const jobPartsDueDateSchema = [
  body('job').exists().withMessage('Missing Job').isMongoId().withMessage('Job must be valid'),
  body('jobPartTitle').exists().withMessage('Missing Job Part Title').isMongoId().withMessage('Job Part must be valid'),
  body('dueDate', 'Due date must be valid').optional().isString(),
  body('startDate', 'Start date must be valid').optional().isString(),
  body('contractor', 'contractor field must be valid').optional().isObject(),
  body('contractor.contact', 'contact invalid').optional().isString(),
  body('contractor.phone', 'invalid phone').optional().isMobilePhone(),
  body('contractor.email', 'invalid email').optional().normalizeEmail().isEmail(),
];

const dueDatePatchSchema = [body('dueDate', 'Due date must be valid').optional().isString(), body('startDate', 'Start date must be valid').optional().isString()];

const jobPartJobDueDateParams = [param('jobid').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid jobid parameter')];
const jobPartDueDateParams = [param('id').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid id parameter')];

module.exports = { jobPartsDueDateSchema, dueDatePatchSchema, jobPartDueDateParams, jobPartJobDueDateParams };

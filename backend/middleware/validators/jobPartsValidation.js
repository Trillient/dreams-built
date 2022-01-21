const { param, body } = require('express-validator');

const jobPartsSchema = [
  body('jobPartTitle').exists().withMessage('Missing Job Part Title').not().isObject().withMessage('Job Part must be a valid').trim().isString().withMessage('Job Part must be a valid'),
  body('jobOrder', 'Job part order must be a number').optional().isNumeric().isInt(),
  body('jobDescription', 'Job Desciption must be valid').optional().isString().not().isBoolean().not().isNumeric().not().isInt().not().isObject(),
];

const jobPartParams = [param('id').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid id parameter')];

module.exports = { jobPartsSchema, jobPartParams };

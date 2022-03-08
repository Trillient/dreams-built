const { param, body } = require('express-validator');

const jobDetailsSchema = [
  body('jobNumber').exists().withMessage('Missing jobNumber').trim().isNumeric().withMessage('Job number must be a valid number').isInt({ min: 0, max: 99999 }).withMessage('Number must be between 0 and 99999'),
  body('client').exists().withMessage('Missing Client').isMongoId().withMessage('Invalid client field'),
  body('address', 'Address must be valid').exists({ checkFalsy: true }).isString().trim(),
  body('city', 'City must be valid').optional().isString().trim(),
  body('area', 'Area must be a number').optional({ checkFalsy: true }).isFloat(),
  body('endClient', 'End Client must be valid').optional({ checkFalsy: true }).isString().trim(),
  body('color', 'Color must be entered as a Hex value').exists().not().isBoolean().isString().isHexColor(),
  body('isInvoiced', 'Invoiced must be a boolean value').optional().not().isInt().isBoolean(),
];

const jobIdParams = [param('id').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid id parameter')];

module.exports = { jobDetailsSchema, jobIdParams };

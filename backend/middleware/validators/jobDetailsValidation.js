const { body } = require('express-validator');

const jobDetailsSchema = [
  body('jobNumber').exists({ checkFalsy: true }).isNumeric().withMessage('Job number must be a valid number').isInt({ min: 0, max: 99999 }).withMessage('Number must be between 0 and 99999'),
  body('client').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid client details'),
  body('address').optional({ checkFalsy: true }).isString().withMessage('Address must be valid'),
  body('city').optional({ checkFalsy: true }).isString().withMessage('City must be valid'),
  body('area').optional({ checkFalsy: true }).isNumeric().withMessage('Area must be a number'),
  body('endClient').optional({ checkFalsy: true }).isString().withMessage('End Client must be valid'),
  body('color').exists({ checkFalsy: true }).isString().isHexColor().withMessage('Color must be entered as a Hex value'),
  body('isInvoiced').optional({ checkFalsy: true }).isBoolean().withMessage('Invoiced must be a boolean value'),
];

module.exports = { jobDetailsSchema };

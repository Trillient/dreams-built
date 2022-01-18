const { body } = require('express-validator');

const jobDetailsSchema = [
  body('jobNumber').exists({ checkFalsy: true }).isNumeric().withMessage('Job number must be a valid number').isInt({ min: 0, max: 99999 }).withMessage('Number must be between 0 and 99999'),
  body('client').exists({ checkFalsy: true }).isMongoId().withMessage('Invalid client details'),
  body('address'),
  body('city'),
  body('area'),
  body('endClient'),
  body('color').exists({ checkFalsy: true }).isString().isHexColor().withMessage('Color must be entered as a Hex value'),
  body('isInvoiced'),
];

module.exports = { jobDetailsSchema };

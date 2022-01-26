const { body, query, param } = require('express-validator');
const { DateTime } = require('luxon');

const timesheetSchema = [
  body('entries.*.entryId', 'Vaild entry id required').exists().isUUID(),
  body('entries.*.day', 'Day must be a valid weekday, ie(Monday)')
    .exists()
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'EEEE');
      return dt.isValid;
    }),
  body('entries.*.date', 'Invalid Date').exists().isDate(),
  body('entries.*.startTime', 'Start time invalid')
    .exists()
    .isString()
    .custom((value) => {
      if (value.length > 5 || value[2] !== ':') {
        return false;
      }
      value.split(':');
      return Boolean(24 > parseFloat(parseInt(value[0], 10) + parseInt(value[1], 10) / 60));
    }),
  body('entries.*.endTime')
    .exists()
    .isString()
    .custom((value) => {
      if (value.length > 5 || value[2] !== ':') {
        return false;
      }
      value.split(':');
      return Boolean(24 > parseFloat(parseInt(value[0], 10) + parseInt(value[1], 10) / 60));
    }),
  body('entries.*.jobNumber', 'Job number required').exists().isInt(),
  body('entries.*.jobTime', 'Job time invalid').exists().isFloat(),
  body('weekStart')
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'dd/MM/yyyy');
      return dt.isValid;
    }),
  body('weekEnd')
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'dd/MM/yyyy');
      return dt.isValid;
    }),
  body('isArchive').optional().isBoolean(),
];

const userQueryParams = [query('id').exists().withMessage('Missing user Query').isMongoId().withMessage('User must be valid')];
const userParams = [param('id').exists().withMessage('Missing user Param').isMongoId().withMessage('User must be valid')];

module.exports = { userQueryParams, userParams, adminAddSchema, timesheetSchema };

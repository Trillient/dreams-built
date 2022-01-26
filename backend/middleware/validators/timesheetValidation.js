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
  body('entries.*.endTime', 'End time invalid')
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
      const dt = DateTime.fromFormat(value, 'yyyy-MM-dd');
      return dt.isValid;
    }),
  body('weekEnd')
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'yyyy-MM-dd');
      return dt.isValid;
    }),
  body('isArchive').optional().isBoolean(),
];

const adminQueryParams = [query('id').exists().withMessage('Missing user Query').isMongoId().withMessage('User must be valid')];
const userParams = [param('id').exists().withMessage('Missing user Param')];
const userQuery = [
  query('weekstart', 'invalid weekstart (yyyy-MM-dd)')
    .exists()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'yyyy-MM-dd');
      return dt.isValid;
    }),
];

module.exports = { adminQueryParams, userParams, userQuery, timesheetSchema };

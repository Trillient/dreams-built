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
  body('entries.*.startTime', 'Start time invalid, "HH:MM" format required')
    .exists()
    .isString()
    .custom((value) => {
      if (value.length > 5 || value[2] !== ':') {
        return false;
      }
      value.split(':');
      return Boolean(24 > parseFloat(parseInt(value[0], 10) + parseInt(value[1], 10) / 60));
    }),
  body('entries.*.endTime', 'End time invalid, "HH:MM" format required')
    .exists()
    .isString()
    .custom((value) => {
      if (value.length > 5 || value[2] !== ':') {
        return false;
      }
      value.split(':');
      return Boolean(24 > parseFloat(parseInt(value[0], 10) + parseInt(value[1], 10) / 60));
    }),
  body('entries.*.jobNumber', 'Job number invalid, must be a positive integer').exists().isInt({ min: 0 }),
  body('entries.*.jobTime', 'Job time invalid').exists().isFloat({ min: 0, max: 24 }),
  body('weekStart', 'Week Start value invalid (dd/MM/yyyy)')
    .exists()
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'dd/MM/yyyy');
      return dt.isValid;
    }),
  body('weekEnd', 'Week End value invalid (dd/MM/yyyy)')
    .optional()
    .isString()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'dd/MM/yyyy');
      return dt.isValid;
    }),
  body('isArchive').optional().isBoolean(),
];

const patchTimesheetSchema = [];

const entryParams = [param('id').exists().withMessage('Missing user Query').isMongoId().withMessage('User must be valid')];
const userParams = [param('id').exists().withMessage('Missing entry Param')];

const weekStartQuery = [
  query('weekstart', 'invalid weekstart (dd/MM/yyyy)')
    .exists()
    .custom((value) => {
      const dt = DateTime.fromFormat(value, 'dd/MM/yyyy');
      return dt.isValid;
    }),
];

module.exports = { entryParams, userParams, weekStartQuery, patchTimesheetSchema, timesheetSchema };

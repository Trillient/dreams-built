const express = require('express');
const router = express.Router();

const { createUserEntry, getAllUsers, deleteArchive, getUserEntries, createAUsersEntry, updateAUsersEntry, deleteAUsersEntry } = require('../controllers/timeSheetController');
const { readTimesheetAuth, createTimesheetAuth, readAllUserTimesheetAuth, createAllUserTimesheetAuth, updateAllUserTimesheetAuth, deleteAllUserTimesheetAuth } = require('../middleware/authMiddleware');
const validation = require('../middleware/validatorMiddleware');
const { userQueryParams, timesheetSchema, userParams } = require('../middleware/validators/timesheetValidation');

router.route('/user/:id').get(readTimesheetAuth, userParams, validation, getUserEntries).post(createTimesheetAuth, userParams, timesheetSchema, validation, createUserEntry);

router
  .route('/admin')
  .get(readAllUserTimesheetAuth, getAllUsers)
  .post(createAllUserTimesheetAuth, userQueryParams, timesheetSchema, validation, createAUsersEntry)
  .patch(updateAllUserTimesheetAuth, userQueryParams, validation, updateAUsersEntry)
  .delete(deleteAllUserTimesheetAuth, userQueryParams, validation, deleteAUsersEntry);
router.route('/admin/archive').delete(deleteAllUserTimesheetAuth, deleteArchive);

module.exports = router;

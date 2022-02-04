const express = require('express');
const router = express.Router();

const { createUserEntry, getAllUsers, getUserEntries, updateAUsersEntry, deleteAUsersEntry } = require('../controllers/timeSheetController');
const { readTimesheetAuth, createTimesheetAuth, readAllUserTimesheetAuth, updateAllUserTimesheetAuth, deleteAllUserTimesheetAuth } = require('../middleware/authMiddleware');
const validation = require('../middleware/validatorMiddleware');
const { entryParams, timesheetSchema, userParams, weekStartQuery, patchTimesheetSchema } = require('../middleware/validators/timesheetValidation');

router.route('/user/:id').get(readTimesheetAuth, userParams, weekStartQuery, validation, getUserEntries).post(createTimesheetAuth, userParams, timesheetSchema, validation, createUserEntry);

router.route('/admin').get(readAllUserTimesheetAuth, weekStartQuery, validation, getAllUsers);
router.route('/admin/users/entry/:id').patch(updateAllUserTimesheetAuth, entryParams, patchTimesheetSchema, validation, updateAUsersEntry).delete(deleteAllUserTimesheetAuth, entryParams, validation, deleteAUsersEntry);

module.exports = router;

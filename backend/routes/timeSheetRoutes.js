const express = require('express');
const router = express.Router();

const { createUserEntry, getAllUsers, deleteArchive, getUserEntries, createAUsersEntry, updateAUsersEntry, deleteAUsersEntry } = require('../controllers/timeSheetController');
const { readTimesheetAuth, createTimesheetAuth, readAllUserTimesheetAuth, createAllUserTimesheetAuth, updateAllUserTimesheetAuth, deleteAllUserTimesheetAuth } = require('../middleware/authMiddleware');
const validation = require('../middleware/validatorMiddleware');

router.route('/user/:id').get(readTimesheetAuth, getUserEntries).post(createTimesheetAuth, createUserEntry);

router.route('/admin').get(readAllUserTimesheetAuth, getAllUsers).post(createAllUserTimesheetAuth, createAUsersEntry).put(updateAllUserTimesheetAuth, updateAUsersEntry).delete(deleteAllUserTimesheetAuth, deleteAUsersEntry);
router.route('/admin/archive').delete(deleteAllUserTimesheetAuth, deleteArchive);

module.exports = router;

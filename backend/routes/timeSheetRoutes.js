const express = require('express');
const router = express.Router();

const { createUserEntry, getAllUsers, deleteArchive, getUserEntries } = require('../controllers/timeSheetController');

router.route('/user/:id').get(getUserEntries).post(createUserEntry);
router.route('/admin').get(getAllUsers);
router.route('/admin/archive').delete(deleteArchive);

module.exports = router;

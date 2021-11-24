const express = require('express');
const router = express.Router();

const { createUserEntry, getAllUsers, deleteArchive } = require('../controllers/timeSheetController');

router.route('/');
router.route('/user/:id').post(createUserEntry);
router.route('/admin').get(getAllUsers);
router.route('/admin/archive').delete(deleteArchive);

module.exports = router;

const express = require('express');
const router = express.Router();

const { createUserEntry, test, deleteArchive } = require('../controllers/timeSheetController');

router.route('/').get(test).delete(deleteArchive);
router.route('/user/:id').post(createUserEntry);

module.exports = router;

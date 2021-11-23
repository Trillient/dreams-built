const express = require('express');
const router = express.Router();

const { createUserEntry } = require('../controllers/timeSheetController');

router.route('/');
router.route('/user/:id').post(createUserEntry);

module.exports = router;

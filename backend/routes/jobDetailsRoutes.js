const express = require('express');
const router = express.Router();

const { getJobs } = require('../controllers/jobDetailsController');

router.route('/').get(getJobs);

module.exports = router;

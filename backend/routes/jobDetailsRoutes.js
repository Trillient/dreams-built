const express = require('express');
const router = express.Router();

const { getJobs, createJob } = require('../controllers/jobDetailsController');

router.route('/').get(getJobs).post(createJob);

module.exports = router;

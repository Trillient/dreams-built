const express = require('express');
const router = express.Router();

const { getJobs, getJob, createJob } = require('../controllers/jobDetailsController');

router.route('/').get(getJobs).post(createJob);
router.route('/:id').get(getJob);

module.exports = router;

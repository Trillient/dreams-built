const express = require('express');
const router = express.Router();

const { checkJwt } = require('../middleware/authMiddleware');
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobDetailsController');

router.route('/').get(checkJwt, getJobs).post(checkJwt, createJob);
router.route('/:id').get(checkJwt, getJob).put(checkJwt, updateJob).delete(checkJwt, deleteJob);

module.exports = router;

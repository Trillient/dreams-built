const express = require('express');
const router = express.Router();

const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobDetailsController');
const { getJobParts, createJobPart, getJobPart, updateJobPart, deleteJobPart } = require('../controllers/jobPartsController');
const { getAllJobDueDates, getJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate } = require('../controllers/jobDueDatesController');

router.route('/details').get(getJobs).post(createJob);
router.route('/details/:id').get(getJob).put(updateJob).delete(deleteJob);

router.route('/parts').get(getJobParts).post(createJobPart);
router.route('/parts/:id').get(getJobPart).put(updateJobPart).delete(deleteJobPart);

router.route('/duedates/parts').get(getAllJobDueDates);
router.route('/duedates/parts/:jobid').get(getJobPartDueDates).post(createJobPartDueDate).delete(deleteJobPartDueDates);
router.route('/duedates/job/:jobid/part/:partid').put(updateJobPartDueDate).delete(deleteJobPartDueDate);

module.exports = router;

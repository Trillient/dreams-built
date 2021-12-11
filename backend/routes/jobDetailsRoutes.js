const express = require('express');
const router = express.Router();

const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobDetailsController');
const { getJobParts, createJobPart, getJobPart, updateJobPart, deleteJobPart } = require('../controllers/jobPartsController');
const { getAllJobDueDates, getJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate } = require('../controllers/jobDueDatesController');

router.route('/details').get(getJobs).post(createJob);
router.route('/details/:id').get(getJob).put(updateJob).delete(deleteJob);

router.route('/parts').get(getJobParts).post(createJobPart);
router.route('/parts/partsid/:id').get(getJobPart).put(updateJobPart).delete(deleteJobPart);

router.route('/parts/duedates').get(getAllJobDueDates);
router.route('/jobid/:id/parts/duedates').get(getJobPartDueDates).post(createJobPartDueDate).delete(deleteJobPartDueDates);
router.route('/jobid/:jobid/partsid/:partid/duedates').put(updateJobPartDueDate).delete(deleteJobPartDueDate);

module.exports = router;

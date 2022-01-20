const express = require('express');
const router = express.Router();

const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobDetailsController');
const { getJobParts, createJobPart, getJobPart, updateJobPart, deleteJobPart } = require('../controllers/jobPartsController');
const { getAllJobDueDates, getJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate } = require('../controllers/jobDueDatesController');
const { readJobDetailsAuth, createJobDetailsAuth, updateJobDetailsAuth, deleteJobDetailsAuth } = require('../middleware/authMiddleware');
const { jobDetailsSchema, jobIdParams } = require('../middleware/validators/jobDetailsValidation');
const validation = require('../middleware/validatorMiddleware');

router.route('/details').get(readJobDetailsAuth, getJobs).post(createJobDetailsAuth, jobDetailsSchema, validation, createJob);
router.route('/details/:id').get(readJobDetailsAuth, jobIdParams, validation, getJob).put(updateJobDetailsAuth, jobIdParams, jobDetailsSchema, validation, updateJob).delete(deleteJobDetailsAuth, jobIdParams, validation, deleteJob);

router.route('/parts').get(getJobParts).post(createJobPart);
router.route('/parts/:id').get(getJobPart).put(updateJobPart).delete(deleteJobPart);

router.route('/duedates/parts').get(getAllJobDueDates);
router.route('/duedates/parts/:jobid').get(getJobPartDueDates).post(createJobPartDueDate).delete(deleteJobPartDueDates);
router.route('/duedates/job/part/:id').put(updateJobPartDueDate).delete(deleteJobPartDueDate);

module.exports = router;

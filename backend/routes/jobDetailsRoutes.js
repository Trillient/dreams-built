const express = require('express');
const router = express.Router();

const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobDetailsController');
const { getJobParts, createJobPart, getJobPart, updateJobPart, deleteJobPart } = require('../controllers/jobPartsController');
const { getJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate } = require('../controllers/jobDueDatesController');

router.route('/details').get(getJobs).post(createJob);
router.route('/details/:id').get(getJob).put(updateJob).delete(deleteJob);

// /api/jobdetails/parts - creates a job part ie, box up, strip + gets a list of all parts
router.route('/parts').get(getJobParts).post(createJobPart);
// /api/jobdetails/parts/:id - get particular part id to update or delete
router.route('/parts/:id').get(getJobPart).put(updateJobPart).delete(deleteJobPart);

// /api/jobdetails/:id/parts/duedates - gets a list of all duedates for a particular job, can delete all due dates
router.route('/:id/parts/duedates').get(getJobPartDueDates).delete(deleteJobPartDueDates);
// /api/jobdetails/:id/parts/:id/duedates - create update and delete a duedate for a given job part for a given job
router.route('/:jobid/parts/:partid/duedates').post(createJobPartDueDate).put(updateJobPartDueDate).delete(deleteJobPartDueDate);

module.exports = router;

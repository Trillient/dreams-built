const express = require('express');
const router = express.Router();

const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobDetailsController');
const { getJobParts, createJobPart, getJobPart, updateJobPart, deleteJobPart } = require('../controllers/jobPartsController');
const { getAllJobDueDates, getJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate, patchJobPartDueDates } = require('../controllers/jobDueDatesController');

const {
  readJobDetailsAuth,
  createJobDetailsAuth,
  updateJobDetailsAuth,
  deleteJobDetailsAuth,
  readJobPartsAuth,
  createJobPartsAuth,
  updateJobPartsAuth,
  deleteJobPartsAuth,
  readJobPartDueDatesAuth,
  createJobPartDueDatesAuth,
  updateJobPartDueDatesAuth,
  deleteJobPartDueDatesAuth,
} = require('../middleware/authMiddleware');
const { jobDetailsSchema, jobIdParams } = require('../middleware/validators/jobDetailsValidation');
const { jobPartsSchema, jobPartParams } = require('../middleware/validators/jobPartsValidation');
const validation = require('../middleware/validatorMiddleware');
const { dueDatePatchSchema, jobPartsDueDateSchema, jobPartJobDueDateParams, jobPartDueDateParams } = require('../middleware/validators/jobPartDueDateValidation');

router.route('/details').get(readJobDetailsAuth, getJobs).post(createJobDetailsAuth, jobDetailsSchema, validation, createJob);
router.route('/details/:id').get(readJobDetailsAuth, jobIdParams, validation, getJob).put(updateJobDetailsAuth, jobIdParams, jobDetailsSchema, validation, updateJob).delete(deleteJobDetailsAuth, jobIdParams, validation, deleteJob);

router.route('/parts').get(readJobPartsAuth, getJobParts).post(createJobPartsAuth, jobPartsSchema, validation, createJobPart);
router.route('/parts/:id').get(readJobPartsAuth, jobPartParams, validation, getJobPart).put(updateJobPartsAuth, jobPartParams, jobPartsSchema, validation, updateJobPart).delete(deleteJobPartsAuth, jobPartParams, validation, deleteJobPart);

router.route('/duedates/parts').get(readJobPartDueDatesAuth, getAllJobDueDates);
router
  .route('/duedates/parts/:jobid')
  .get(readJobPartDueDatesAuth, jobPartJobDueDateParams, validation, getJobPartDueDates)
  .post(createJobPartDueDatesAuth, jobPartJobDueDateParams, jobPartsDueDateSchema, validation, createJobPartDueDate)
  .patch(updateJobPartDueDatesAuth, jobPartJobDueDateParams, dueDatePatchSchema, validation, patchJobPartDueDates)
  .delete(deleteJobPartDueDatesAuth, jobPartJobDueDateParams, deleteJobPartDueDates);
router.route('/duedates/job/part/:id').put(updateJobPartDueDatesAuth, jobPartDueDateParams, jobPartsDueDateSchema, validation, updateJobPartDueDate).delete(deleteJobPartDueDatesAuth, deleteJobPartDueDate);

module.exports = router;

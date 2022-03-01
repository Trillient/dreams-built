const express = require('express');
const router = express.Router();

const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobDetailsController');
const { getJobParts, createJobPart, getJobPart, updateJobPart, deleteJobPart, updateJobParts } = require('../controllers/jobPartsController');
const { getAllJobDueDates, getJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate, patchJobPartDueDates, patchJobPartDueDate } = require('../controllers/jobDueDatesController');

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
const { shiftPatchSchema, dueDateQuerySchema, dueDateIdParams, dueDatePartIdQueryParams, dueDateJobIdParams, dueDateFullSchema, dueDatePartialSchema } = require('../middleware/validators/jobPartDueDateValidation');
const { paginationQuery } = require('../middleware/validators/paginationQueryValidation');

// Job details
router.route('/details').get(readJobDetailsAuth, paginationQuery, validation, getJobs).post(createJobDetailsAuth, jobDetailsSchema, validation, createJob);
router.route('/details/:id').get(readJobDetailsAuth, jobIdParams, validation, getJob).put(updateJobDetailsAuth, jobIdParams, jobDetailsSchema, validation, updateJob).delete(deleteJobDetailsAuth, jobIdParams, validation, deleteJob);

// Job parts
//TODO - patch update validations + add tests
router.route('/parts').get(readJobPartsAuth, paginationQuery, validation, getJobParts).post(createJobPartsAuth, jobPartsSchema, validation, createJobPart).patch(updateJobPartsAuth, updateJobParts);
router.route('/parts/:id').get(readJobPartsAuth, jobPartParams, validation, getJobPart).put(updateJobPartsAuth, jobPartParams, jobPartsSchema, validation, updateJobPart).delete(deleteJobPartsAuth, jobPartParams, validation, deleteJobPart);

// Job due dates
router.route('/duedates/parts').get(readJobPartDueDatesAuth, dueDateQuerySchema, validation, getAllJobDueDates);
router
  .route('/duedates/parts/:jobid')
  .get(readJobPartDueDatesAuth, dueDateJobIdParams, validation, getJobPartDueDates)
  .post(createJobPartDueDatesAuth, dueDateJobIdParams, dueDatePartIdQueryParams, dueDateFullSchema, validation, createJobPartDueDate)
  .patch(updateJobPartDueDatesAuth, dueDateJobIdParams, shiftPatchSchema, validation, patchJobPartDueDates)
  .delete(deleteJobPartDueDatesAuth, dueDateJobIdParams, validation, deleteJobPartDueDates);
router
  .route('/duedates/job/part/:id')
  .put(updateJobPartDueDatesAuth, dueDateIdParams, dueDateFullSchema, validation, updateJobPartDueDate)
  .patch(updateJobPartDueDatesAuth, dueDateIdParams, dueDatePartialSchema, validation, patchJobPartDueDate)
  .delete(deleteJobPartDueDatesAuth, dueDateIdParams, validation, deleteJobPartDueDate);

module.exports = router;

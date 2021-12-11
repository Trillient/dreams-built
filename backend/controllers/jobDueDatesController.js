const asyncHandler = require('express-async-handler');
const JobDueDate = require('../models/jobPartDueDateModel');

/**
 * @Desc Get a list of all due dates for every job
 * @Route /api/job/duedates/parts
 * @Access Private (employee, admin)
 */

const getAllJobDueDates = asyncHandler(async (req, res) => {
  const jobList = await JobDueDate.find({}).populate('job jobDescription', 'jobNumber client address jobPartTitle jobOrder');

  res.json(jobList);
});

/**
 * @Desc Get a list of all due dates for a job
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private (employee, admin)
 */

const getJobPartDueDates = asyncHandler(async (req, res) => {
  const jobId = req.params.jobid;
  const jobDueDates = await JobDueDate.find({ job: jobId });
  res.json(jobDueDates);
});

/**
 * @Desc Delete all of a job's duedates
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private (admin)
 */

const deleteJobPartDueDates = asyncHandler(async (req, res) => {});

/**
 * @Desc Create a job's part duedates
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private (admin)
 */

const createJobPartDueDate = asyncHandler(async (req, res) => {
  const jobParts = req.body;
  const jobId = req.params.jobid;

  for (job of jobParts) {
    const exists = await JobDueDate.findOne({ job: jobId, jobDescription: job.jobPart });
    if (exists) {
      res.status(400);
      throw new Error('Due date already exists');
    } else {
      await JobDueDate.create({ job: jobId, jobDescription: job.jobPart, dueDate: job.dueDate });
    }
  }

  res.status(201).json({ message: 'Due date saved!' });
});

/**
 * @Desc Update a job's part's duedate
 * @Route /api/job/
 * @Access Private (admin)
 */

const updateJobPartDueDate = asyncHandler(async (req, res) => {});

/**
 * @Desc Delete a job's part's duedate
 * @Route /api/job/
 * @Access Private (admin)
 */

const deleteJobPartDueDate = asyncHandler(async (req, res) => {});

module.exports = { getAllJobDueDates, getJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate };

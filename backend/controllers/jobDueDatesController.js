const asyncHandler = require('express-async-handler');
const JobDueDate = require('../models/jobPartDueDateModel');
const JobPart = require('../models/jobPartModel');

/**
 * @Desc Get a list of all due dates for every job
 * @Route /api/job/duedates/parts
 * @Access Private (employee, admin)
 */

const getAllJobDueDates = asyncHandler(async (req, res) => {
  const jobDueDates = await JobDueDate.find({}).populate('job jobPartTitle', 'jobNumber client address jobPartTitle jobOrder');

  res.json(jobDueDates);
});

/**
 * @Desc Get a list of all due dates for a job
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private (employee, admin)
 */

const getJobPartDueDates = asyncHandler(async (req, res) => {
  const jobId = req.params.jobid;
  const jobDueDates = await JobDueDate.find({ job: jobId }).populate('jobPartTitle', 'jobPartTitle');
  res.json(jobDueDates);
});

/**
 * @Desc Delete all of a job's duedates
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private (admin)
 */

const deleteJobPartDueDates = asyncHandler(async (req, res) => {
  const jobId = req.params.jobid;
  await JobDueDate.deleteMany({ job: jobId });
  res.json({ message: 'deleted!' });
});

/**
 * @Desc Create a job's part duedates
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private (admin)
 */

const createJobPartDueDate = asyncHandler(async (req, res) => {
  const jobId = req.params.jobid;

  const partId = req.query.partid;
  await JobPart.findById(partId);

  const exists = await JobDueDate.findOne({ job: jobId, jobPartTitle: partId });

  if (exists) {
    res.status(400);
    throw new Error('Due date already exists');
  }
  const created = await JobDueDate.create({ job: jobId, jobPartTitle: partId });

  res.status(201).json(created);
});

/**
 * @Desc Update a job's part's duedate
 * @Route /api/job/duedates/job/part/:id
 * @Access Private (admin)
 */

const updateJobPartDueDate = asyncHandler(async (req, res) => {
  const { dueDate, contractor } = req.body;
  const jobPartDueDateItem = await JobDueDate.findById(req.params.id);

  if (jobPartDueDateItem) {
    jobPartDueDateItem.dueDate = dueDate;
    if (contractor) {
      jobPartDueDateItem.contractor = contractor;
    }
    const updatedDueDate = await jobPartDueDateItem.save();
    res.json(updatedDueDate);
  }
});

/**
 * @Desc Delete a job's part's duedate
 * @Route /api/job/
 * @Access Private (admin)
 */

const deleteJobPartDueDate = asyncHandler(async (req, res) => {
  const jobDueDate = await JobDueDate.findById(req.params.id);

  if (jobDueDate) {
    await jobDueDate.remove();
    res.json({ message: 'Deleted!' });
  } else {
    res.status(404);
  }
});

module.exports = { getAllJobDueDates, getJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate };

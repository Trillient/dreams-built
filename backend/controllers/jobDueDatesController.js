const asyncHandler = require('express-async-handler');
const { DateTime } = require('luxon');
const JobDetails = require('../models/jobModel');
const JobDueDate = require('../models/jobPartDueDateModel');
const JobPart = require('../models/jobPartModel');

/**
 * @Desc Get a list of all due dates for every job
 * @Route /api/job/duedates/parts
 * @Access Private ("read:due_dates", employee, admin)
 */

const getAllJobDueDates = asyncHandler(async (req, res) => {
  const jobDueDates = await JobDueDate.find({ dueDateRange: { $gte: req.query.rangeStart, $lt: req.query.rangeEnd } }).populate('job jobPartTitle', 'jobNumber client address jobPartTitle jobOrder color');

  res.json(jobDueDates);
});

/**
 * @Desc Get a list of all due dates for a job
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private ("read:due_dates", employee, admin)
 */

const getJobPartDueDates = asyncHandler(async (req, res) => {
  const jobParams = req.params.jobid;

  const checkJobExists = await JobDetails.findById(jobParams);

  if (checkJobExists) {
    const jobDueDates = await JobDueDate.find({ job: req.params.jobid }).populate('jobPartTitle', 'jobPartTitle');
    res.json(jobDueDates);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

/**
 * @Desc Create a job's part duedates
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private ("create:due_dates", admin)
 */

const createJobPartDueDate = asyncHandler(async (req, res) => {
  const { dueDate, contractor } = req.body;
  const jobId = req.params.jobid;

  const checkJobExists = await JobDetails.findById(jobId);

  if (!checkJobExists) {
    res.status(404);
    throw new Error('Job does not exist');
  }

  const partId = req.query.partid;
  const checkJobPartExists = await JobPart.findById(partId);

  if (!checkJobPartExists) {
    res.status(404);
    throw new Error('Job part does not exist');
  }

  const dueDateExists = await JobDueDate.findOne({ job: jobId, jobPartTitle: partId });

  if (dueDateExists) {
    res.status(400);
    throw new Error('Due date already exists');
  } else {
    const created = await JobDueDate.create({ job: jobId, jobPartTitle: partId, dueDate: dueDate, dueDateRange: dueDate, contractor: contractor });

    res.status(201).json(created);
  }
});

/**
 * @Desc Update due dates of all due dates for a job
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private ("update:due_dates" admin)
 */

const patchJobPartDueDates = asyncHandler(async (req, res) => {
  const shift = req.body.scheduleShift;
  const jobId = req.params.jobid;

  const jobDueDates = await JobDueDate.find({ job: jobId });

  if (jobDueDates.length > 0) {
    for (const dueDate of jobDueDates) {
      const newDueDate = DateTime.fromFormat(dueDate.dueDate, 'yyyy-MM-dd').plus({ days: shift }).toFormat('yyyy-MM-dd');
      await JobDueDate.findByIdAndUpdate(dueDate._id, {
        dueDate: newDueDate,
        dueDateRange: newDueDate,
      });
    }

    res.json({ message: `Due Dates shifted by ${shift} day(s)` });
  } else {
    res.status(404);
    throw new Error('Due date not found');
  }
});

/**
 * @Desc Delete all of a job's duedates
 * @Route /api/job/duedates/parts/:jobid
 * @Access Private ("delete:due_dates", admin)
 */

const deleteJobPartDueDates = asyncHandler(async (req, res) => {
  const jobId = req.params.jobid;

  const checkDueDatesExist = await JobDueDate.find({ job: jobId });

  if (checkDueDatesExist.length > 0) {
    await JobDueDate.deleteMany({ job: jobId });
    res.json({ message: 'deleted!' });
  } else {
    res.status(404);
    throw new Error("Due dates don't exist for this job");
  }
});

/**
 * @Desc Update a job's part's duedate all fields
 * @Route /api/job/duedates/job/part/:id
 * @Access Private (admin)
 */

const updateJobPartDueDate = asyncHandler(async (req, res) => {
  const { dueDate, contractor } = req.body;
  const jobPartDueDateItem = await JobDueDate.findById(req.params.id);

  if (jobPartDueDateItem) {
    jobPartDueDateItem.dueDate = dueDate;
    jobPartDueDateItem.dueDateRange = dueDate;
    jobPartDueDateItem.contractor = contractor;

    const updatedDueDate = await jobPartDueDateItem.save();
    res.json(updatedDueDate);
  }
});

/**
 * @Desc Update a job's part's duedate field only
 * @Route /api/job/duedates/job/part/:id
 * @Access Private (admin)
 */

const patchJobPartDueDate = asyncHandler(async (req, res) => {
  const { dueDate } = req.body;
  const jobPartDueDateItem = await JobDueDate.findById(req.params.id);

  if (jobPartDueDateItem) {
    await JobDueDate.findByIdAndUpdate(req.params.id, {
      dueDate: dueDate,
      dueDateRange: dueDate,
    });

    res.json({ message: 'due date updated' });
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

module.exports = { getAllJobDueDates, getJobPartDueDates, patchJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, patchJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate };

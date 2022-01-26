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
  const jobDueDates = await JobDueDate.find({ dueDateRange: { $elemMatch: { $gte: req.query.rangeStart, $lt: req.query.rangeEnd } } }).populate('job jobPartTitle', 'jobNumber client address jobPartTitle jobOrder color');

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
  const { dueDate, contractor, startDate, dueDateRange } = req.body;
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
    const created = await JobDueDate.create({ job: jobId, jobPartTitle: partId, dueDate: dueDate, startDate: startDate, dueDateRange: dueDateRange, contractor: contractor });

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
      const newStartDate = DateTime.fromFormat(dueDate.startDate, 'yyyy-MM-dd').plus({ days: shift }).toFormat('yyyy-MM-dd');
      let dateRange = [];

      if (dueDate.startDate && dueDate.dueDate) {
        const daysInterval = Interval.fromDateTimes(DateTime.fromFormat(newStartDate, 'yyyy-MM-dd'), DateTime.fromFormat(newDueDate, 'yyyy-MM-dd'));
        const interval = daysInterval.length('days') + 1;

        for (let i = 0; i < interval; i++) {
          dateRange.push(DateTime.fromFormat(newStartDate, 'yyyy-MM-dd').plus({ days: i }).toFormat('yyyy-MM-dd'));
        }
      } else if (dueDate.startDate) {
        dateRange.push(newStartDate);
      } else if (dueDate.dueDate) {
        dateRange.push(newDueDate);
      }

      await JobDueDate.findByIdAndUpdate(dueDate._id, {
        dueDate: newDueDate,
        startDate: newStartDate,
        dueDateRange: dateRange,
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
 * @Access Private ("update:due_dates", admin)
 */

const updateJobPartDueDate = asyncHandler(async (req, res) => {
  const { dueDate, startDate, dueDateRange, contractor } = req.body;
  const jobPartDueDateItem = await JobDueDate.findById(req.params.id);

  if (jobPartDueDateItem) {
    jobPartDueDateItem.dueDate = dueDate;
    jobPartDueDateItem.startDate = startDate;
    jobPartDueDateItem.dueDateRange = dueDateRange;
    jobPartDueDateItem.contractor = contractor;

    const updatedDueDate = await jobPartDueDateItem.save();
    res.json(updatedDueDate);
  } else {
    res.status(404);
    throw new Error('Due date not found');
  }
});

/**
 * @Desc Update a job's part's duedate field only
 * @Route /api/job/duedates/job/part/:id
 * @Access Private ('update:due_dates', admin)
 */

const patchJobPartDueDate = asyncHandler(async (req, res) => {
  const { dueDate, startDate, dueDateRange } = req.body;
  const jobPartDueDateItem = await JobDueDate.findById(req.params.id);

  if (jobPartDueDateItem) {
    await JobDueDate.findByIdAndUpdate(req.params.id, {
      dueDate: dueDate,
      dueDateRange: dueDateRange,
      startDate: startDate,
    });

    res.json({ message: 'due date updated' });
  } else {
    res.status(404);
    throw new Error('Due date not found');
  }
});

/**
 * @Desc Delete a job's part's duedate
 * @Route /api/job/
 * @Access Private ('delete:due_dates', admin)
 */

const deleteJobPartDueDate = asyncHandler(async (req, res) => {
  const jobDueDate = await JobDueDate.findById(req.params.id);

  if (jobDueDate) {
    await jobDueDate.remove();
    res.json({ message: 'Deleted!' });
  } else {
    res.status(404);
    throw new Error('Due date not found');
  }
});

module.exports = { getAllJobDueDates, getJobPartDueDates, patchJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, patchJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate };

const asyncHandler = require('express-async-handler');
const Client = require('../models/clientModel');
const JobDetails = require('../models/jobModel');
const JobDueDate = require('../models/jobPartDueDateModel');
const TimesheetEntry = require('../models/timesheetEntryModel');

/**
 * @Desc Get a list of all Jobs
 * @Route GET /api/job/details
 * @Access Private ("read:jobs", employee, admin)
 */

const getJobs = asyncHandler(async (req, res) => {
  const pageSize = +req.query.limit || 25;
  const page = +req.query.page || 1;

  const keyword = req.query.keyword
    ? {
        $and: [
          {
            $or: [
              {
                jobs: {
                  $regex: req.query.keyword,
                  $options: 'i',
                },
              },
              {
                address: {
                  $regex: req.query.keyword,
                  $options: 'i',
                },
              },
              {
                city: {
                  $regex: req.query.keyword,
                  $options: 'i',
                },
              },
            ],
          },
        ],
      }
    : {};
  const count = await JobDetails.aggregate([{ $addFields: { jobs: { $toString: '$jobNumber' } } }, { $match: { ...keyword } }]);
  const jobs = await JobDetails.aggregate([{ $addFields: { jobs: { $toString: '$jobNumber' } } }, { $sort: { jobNumber: -1 } }, { $match: { ...keyword } }, { $skip: pageSize * (page - 1) }, { $limit: pageSize }]);

  const jobList = await JobDetails.populate(jobs, { path: 'client' });
  res.json({ jobList, pages: Math.ceil(count.length / pageSize) });
});

/**
 * @Desc Create a new Job
 * @Route POST /api/job/details
 * @Access Private ("create:jobs", admin)
 */

const createJob = asyncHandler(async (req, res) => {
  const { jobNumber, client, address, city, area, isInvoiced, endClient, color } = req.body;

  const jobExists = await JobDetails.findOne({ jobNumber: jobNumber });

  if (jobExists) {
    res.status(400);
    throw new Error('Job Number already exists!');
  }

  const addressUsed = await JobDetails.findOne({ address: address });

  if (addressUsed) {
    res.status(400);
    throw new Error('Address already exists!');
  }

  const clientExists = await Client.findById(client);

  if (!clientExists) {
    res.status(400);
    throw new Error('Client does not exist');
  }

  const parsedArea = area ? parseFloat(area) : 0;

  const createdJob = await JobDetails.create({
    jobNumber: +jobNumber,
    client: client,
    address: address,
    city: city,
    area: parsedArea,
    isInvoiced: isInvoiced,
    endClient: endClient,
    color: color,
  });

  res.status(201).json({ message: 'Job Created', createdJob: createdJob });
});

/**
 * @Desc Get a single Job
 * @Route GET /api/job/details/:id
 * @Access Private ("read:jobs", admin)
 */

const getJob = asyncHandler(async (req, res) => {
  const job = await JobDetails.findById(req.params.id).populate('client');

  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job does not exist');
  }
});

/**
 * @Desc Update a single Job
 * @Route PUT /api/job/details/:id
 * @Access Private ('update:jobs', admin)
 */

const updateJob = asyncHandler(async (req, res) => {
  const { jobNumber, client, address, city, area, endClient, color, isInvoiced } = req.body;

  const clientExists = await Client.findById(client);

  if (!clientExists) {
    res.status(400);
    throw new Error('Client does not exist');
  }

  const job = await JobDetails.findById(req.params.id);

  if (job) {
    const checkJobNumberDuplicate = await JobDetails.findOne({ jobNumber: jobNumber });

    if (checkJobNumberDuplicate && String(job._id) !== String(checkJobNumberDuplicate._id)) {
      res.status(400);
      throw new Error('JobNumber already exists');
    }

    const addressUsed = await JobDetails.findOne({ address: address });

    if (addressUsed && String(job._id) !== String(addressUsed._id)) {
      res.status(400);
      throw new Error('Address already exists!');
    }

    job.jobNumber = +jobNumber;
    job.client = client;
    job.address = address;
    job.city = city;
    job.area = area;
    job.isInvoiced = isInvoiced;
    job.endClient = endClient;
    job.color = color;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

/**
 * @Desc Delete a single Job
 * @Route DELETE /api/job/details/:id
 * @Access Private ('delete:jobs', admin)
 */

const deleteJob = asyncHandler(async (req, res) => {
  const job = await JobDetails.findById(req.params.id);

  if (job) {
    const checkJobUsedInDueDate = await JobDueDate.find({ job: job._id });
    if (checkJobUsedInDueDate.length > 0) {
      res.status(400);
      throw new Error('Must remove all Job Due Dates first');
    }

    const checkJobUsedInTimesheetEntry = await TimesheetEntry.find({ job: job._id });
    if (checkJobUsedInTimesheetEntry.length > 0) {
      res.status(400);
      throw new Error('Job is referenced in Timesheet Entries');
    } else {
      await job.remove();
      res.json({ message: 'Job removed' });
    }
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob };

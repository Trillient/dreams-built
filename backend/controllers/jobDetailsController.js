const asyncHandler = require('express-async-handler');
const Client = require('../models/clientModel');
const JobDetails = require('../models/jobModel');

/**
 * @Desc Get a list of all Jobs
 * @Route GET /api/job/details
 * @Access Private ("read:jobs", employee, admin)
 */

const getJobs = asyncHandler(async (req, res) => {
  const jobList = await JobDetails.find().populate('client', 'clientName color');
  res.json(jobList);
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
 * @Access Private (admin) //TODO - make private
 */

const getJob = asyncHandler(async (req, res) => {
  const job = await JobDetails.findById(req.params.id).populate('client');

  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

/**
 * @Desc Update a single Job
 * @Route PUT /api/job/details/:id
 * @Access Private (admin) //TODO - make private
 */

const updateJob = asyncHandler(async (req, res) => {
  const { client, address, city, area, isInvoiced, endClient, color, dueDates } = req.body;

  const job = await JobDetails.findById(req.params.id);

  if (job) {
    job.client = client;
    job.address = address;
    job.city = city;
    job.area = area;
    job.isInvoiced = isInvoiced;
    job.endClient = endClient;
    job.color = color;
    job.dueDates = dueDates;

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
 * @Access Private (admin) //TODO - make private
 */

const deleteJob = asyncHandler(async (req, res) => {
  const job = await JobDetails.findById(req.params.id);

  if (job) {
    await job.remove();
    res.json({ message: 'Job removed' });
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob };

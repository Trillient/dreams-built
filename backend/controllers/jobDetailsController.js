const asyncHandler = require('express-async-handler');
const JobDetails = require('../models/jobModel');

/**
 * @Desc Get a list of all Jobs
 * @Route GET /api/job/details
 * @Access Private (employee, admin) //TODO - make private
 */

const getJobs = asyncHandler(async (req, res) => {
  const jobList = await JobDetails.find({}).populate('client', 'id clientName color');
  res.json(jobList);
});

/**
 * @Desc Create a new Job
 * @Route POST /api/job/details
 * @Access Private (admin) //TODO - make private
 */

const createJob = asyncHandler(async (req, res) => {
  const { jobNumber, client, address, city, area, isInvoiced, endClient, color, dueDates } = req.body;

  const checkJobExists = await JobDetails.findOne({ jobNumber: jobNumber });

  if (checkJobExists) {
    res.status(400);
    throw new Error('Job Number already exists!');
  }

  const job = new JobDetails({
    jobNumber: jobNumber,
    client: client,
    address: address,
    city: city,
    area: area,
    isInvoiced: isInvoiced,
    endClient: endClient,
    color: color,
    dueDates: dueDates,
  });

  const createdJob = await job.save();

  res.status(201).json(createdJob);
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

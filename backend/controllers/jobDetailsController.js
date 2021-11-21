const asyncHandler = require('express-async-handler');
const JobDetails = require('../models/jobModel');

/**
 * @Desc Get a list of all Jobs
 * @Route GET /api/jobdetails
 * @Access Private (every user) //TODO - make private
 */

const getJobs = asyncHandler(async (req, res) => {
  const jobList = await JobDetails.find();
  res.json(jobList);
});

/**
 * @Desc Get a single Job
 * @Route GET /api/jobdetails/:id
 * @Access Private (only admin) //TODO - make private
 */

const getJob = asyncHandler(async (req, res) => {
  const job = await JobDetails.findById(req.params.id);

  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

/**
 * @Desc Create a new Job
 * @Route POST /api/jobdetails
 * @Access Private (only admin) //TODO - make private
 */

const createJob = asyncHandler(async (req, res) => {
  const { jobNumber, company, address, city, client, area, isInvoiced, dueDates } = req.body;

  const checkJobExists = await JobDetails.findOne({ jobNumber: jobNumber });

  if (checkJobExists) {
    res.status(400);
    throw new Error('Job Number already exists!');
  }

  const job = new JobDetails({
    jobNumber: jobNumber,
    company: company,
    address: address,
    city: city,
    client: client,
    area: area,
    isInvoiced: isInvoiced,
    dueDates: dueDates,
  });

  const createdJob = await job.save();

  res.status(201).json(createdJob);
});

/**
 * @Desc Update a single Job
 * @Route PUT /api/jobdetails/:id
 * @Access Private (only admin) //TODO - make private
 */

const updateJob = asyncHandler(async (req, res) => {
  const { company, address, city, client, area, isInvoiced, dueDates } = req.body;

  const job = await JobDetails.findById(req.params.id);

  if (job) {
    job.company = company;
    job.address = address;
    job.city = city;
    job.client = client;
    job.area = area;
    job.isInvoiced = isInvoiced;
    job.dueDates = dueDates;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

module.exports = { getJobs, getJob, createJob, updateJob };

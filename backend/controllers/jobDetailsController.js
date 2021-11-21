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
 * @Desc Create a new Job
 * @Route POST /api/jobdetails
 * @Access Private (only admin)
 */

const createJob = asyncHandler(async (req, res) => {
  const { jobNumber, company, address, city, client, area, isInvoiced, dueDates } = req.body;
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

module.exports = { getJobs, createJob };

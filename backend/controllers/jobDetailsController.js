const asyncHandler = require('express-async-handler');
const JobDetails = require('../models/jobModel');

const getJobs = asyncHandler(async (req, res) => {
  const jobList = await JobDetails.find();
  res.json(jobList);
});

module.exports = { getJobs };

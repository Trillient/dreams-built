const asyncHandler = require('express-async-handler');
const JobPart = require('../models/jobPartModel');
const { createJob } = require('./jobDetailsController');

/**
 * @Desc Get a list of all job parts
 * @Route GET /api/job/parts
 * @Access Private (employee, admin)
 */

const getJobParts = asyncHandler(async (req, res) => {
  const jobParts = await JobPart.find({});
  res.json(jobParts);
});

/**
 * @Desc Create a new job part
 * @Route POST /api/job/parts
 * @Access Private (admin)
 */

const createJobPart = asyncHandler(async (req, res) => {
  const { jobPartTitle, jobDescription } = req.body;

  const checkJobPartExists = await JobPart.findOne({ jobPartTitle: jobPartTitle });

  if (checkJobPartExists) {
    res.status(400);
    throw new Error('Job Part already exists!');
  }

  const createdJobPart = await JobPart.create({
    jobPartTitle: jobPartTitle,
    jobDescription: jobDescription,
  });

  res.status(201).json(createdJobPart);
});

/**
 * @Desc Get a job part
 * @Route GET /api/job/parts/:id
 * @Access Private (admin)
 */

const getJobPart = asyncHandler(async (req, res) => {
  const jobPart = await JobPart.findById(req.params.id);

  if (jobPart) {
    res.json(jobPart);
  } else {
    res.status(404);
  }
});

/**
 * @Desc Update a job part
 * @Route PUT /api/job/parts/:id
 * @Access Private (admin)
 */

const updateJobPart = asyncHandler(async (req, res) => {});

/**
 * @Desc Delete a job part
 * @Route DELETE /api/job/parts/:id
 * @Access Private (admin)
 */

const deleteJobPart = asyncHandler(async (req, res) => {});

module.exports = { getJobParts, createJobPart, getJobPart, updateJobPart, deleteJobPart };

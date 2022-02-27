const asyncHandler = require('express-async-handler');
const JobPart = require('../models/jobPartModel');
const JobDueDate = require('../models/jobPartDueDateModel');

/**
 * @Desc Get a list of all job parts
 * @Route GET /api/job/parts
 * @Access Private ("read:job_parts", employee, admin)
 */

const getJobParts = asyncHandler(async (req, res) => {
  const pageSize = +req.query.limit || 25;
  const page = +req.query.page || 1;

  const keyword = req.query.keyword
    ? {
        jobPartTitle: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await JobPart.countDocuments({ ...keyword });
  const jobParts = await JobPart.find({ ...keyword })
    .sort({ jobOrder: 1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ jobParts, pages: Math.ceil(count / pageSize) });
});

/**
 * @Desc Create a new job part
 * @Route POST /api/job/parts
 * @Access Private ("create:job_parts", admin)
 */

const createJobPart = asyncHandler(async (req, res) => {
  const { jobPartTitle, jobOrder, jobDescription } = req.body;

  const checkJobPartExists = await JobPart.findOne({ jobPartTitle: jobPartTitle });

  const allJobParts = await JobPart.find();

  if (checkJobPartExists) {
    res.status(400);
    throw new Error('Job Part already exists!');
  }

  const parseJobOrder = jobOrder ? +jobOrder : allJobParts.length;

  const createdJobPart = await JobPart.create({
    jobPartTitle: jobPartTitle,
    jobDescription: jobDescription,
    jobOrder: parseJobOrder,
  });

  res.status(201).json(createdJobPart);
});

/**
 * @Desc Update all job part's order
 * @Route PATCH /api/job/parts
 * @Access Private ("update:job_parts", admin)
 */

const updateJobParts = asyncHandler(async (req, res) => {
  const jobPartList = req.body;

  let errors = [];

  for (const jobPart of jobPartList) {
    const jobPartData = await JobPart.findById(jobPart._id);

    if (jobPartData) {
      jobPartData.jobOrder = jobPart.jobOrder;
      await jobPartData.save();
    } else {
      errors.push({ msg: `${jobPart._id} - Not Found` });
    }
  }

  if (errors.length > 0) {
    res.status(400);
    res.json({ errors: errors });
  } else {
    const jobParts = await JobPart.find().sort({ jobOrder: 1 });
    res.json(jobParts);
  }
});

/**
 * @Desc Get a job part
 * @Route GET /api/job/parts/:id
 * @Access Private ("get:job_parts", admin)
 */

const getJobPart = asyncHandler(async (req, res) => {
  const jobPart = await JobPart.findById(req.params.id);

  if (jobPart) {
    res.json(jobPart);
  } else {
    res.status(404);
    throw new Error('Job part not found');
  }
});

/**
 * @Desc Update a job part
 * @Route PUT /api/job/parts/:id
 * @Access Private ("update:job_parts", admin)
 */

const updateJobPart = asyncHandler(async (req, res) => {
  const { jobPartTitle, jobDescription } = req.body;

  const jobPartData = await JobPart.findById(req.params.id);

  if (jobPartData) {
    jobPartData.jobPartTitle = jobPartTitle;
    jobPartData.jobDescription = jobDescription;

    const updatedJobPart = await jobPartData.save();
    res.json(updatedJobPart);
  } else {
    res.status(404);
    throw new Error('Job part not found');
  }
});

/**
 * @Desc Delete a job part
 * @Route DELETE /api/job/parts/:id
 * @Access Private ("delete:job_parts", admin)
 */

const deleteJobPart = asyncHandler(async (req, res) => {
  const jobPart = await JobPart.findById(req.params.id);
  if (jobPart) {
    const checkJobPartUsedInDueDate = await JobDueDate.find({ jobPartTitle: jobPart._id });
    if (checkJobPartUsedInDueDate.length > 0) {
      res.status(400);
      throw new Error('Must remove all Job Due Dates first');
    } else {
      await jobPart.remove();
      res.json({ message: 'Job part removed' });
    }
  } else {
    res.status(404);
    throw new Error('Job part not found');
  }
});

module.exports = { getJobParts, createJobPart, updateJobParts, getJobPart, updateJobPart, deleteJobPart };

const asyncHandler = require('express-async-handler');
const JobPart = require('../models/jobPartModel');

/**
 * @Desc Get a list of all job parts
 * @Route GET /api/job/parts
 * @Access Private (employee, admin)
 */

const getJobParts = asyncHandler(async (req, res) => {});

/**
 * @Desc Create a new job part
 * @Route POST /api/job/parts
 * @Access Private (admin)
 */

const createJobPart = asyncHandler(async (req, res) => {});

/**
 * @Desc Get a job part
 * @Route POST /api/job/parts/:id
 * @Access Private (admin)
 */

const getJobPart = asyncHandler(async (req, res) => {});

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

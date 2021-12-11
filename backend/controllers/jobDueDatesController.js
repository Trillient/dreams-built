const asyncHandler = require('express-async-handler');
const JobDueDate = require('../models/jobPartDueDateModel');

/**
 * @Desc Get a list of all due dates for every job
 * @Route /api/job/parts/duedates
 * @Access Private (employee, admin)
 */

const getAllJobDueDates = asyncHandler(async (req, res) => {});

/**
 * @Desc Get a list of all due dates for a job
 * @Route /api/job/:id/parts/duedates
 * @Access Private (employee, admin)
 */

const getJobPartDueDates = asyncHandler(async (req, res) => {});

/**
 * @Desc Delete all of a job's duedates
 * @Route /api/job/:id/parts/duedates
 * @Access Private (admin)
 */

const deleteJobPartDueDates = asyncHandler(async (req, res) => {});

/**
 * @Desc Create a job's part duedates
 * @Route /api/job/:id/parts/duedates
 * @Access Private (admin)
 */

const createJobPartDueDate = asyncHandler(async (req, res) => {});

/**
 * @Desc Update a job's part's duedate
 * @Route /api/job/:jobid/parts/:partid/duedates
 * @Access Private (admin)
 */

const updateJobPartDueDate = asyncHandler(async (req, res) => {});

/**
 * @Desc Delete a job's part's duedate
 * @Route /api/job/:jobid/parts/:partid/duedates
 * @Access Private (admin)
 */

const deleteJobPartDueDate = asyncHandler(async (req, res) => {});

module.exports = { getAllJobDueDates, getJobPartDueDates, deleteJobPartDueDates, createJobPartDueDate, updateJobPartDueDate, deleteJobPartDueDate };

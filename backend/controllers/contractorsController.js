const asyncHandler = require('express-async-handler');
const Contractor = require('../models/contractorModel');

/**
 * @Desc Get a list of all Contractors
 * @Route GET /api/contractors
 * @Access Private ("read:contractors" permission, Employee + Admin)
 */

const getContractors = asyncHandler(async (req, res) => {
  const contractorList = await Contractor.find();
  res.json(contractorList);
});

const createContractors = asyncHandler(async (req, res) => {});

const getContractor = asyncHandler(async (req, res) => {});

const updateContractor = asyncHandler(async (req, res) => {});

const deleteContractor = asyncHandler(async (req, res) => {});

module.exports = { getContractors, createContractors, getContractor, updateContractor, deleteContractor };

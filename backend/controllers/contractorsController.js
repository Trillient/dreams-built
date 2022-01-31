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

/**
 * @Desc Create a Contractor
 * @Route POST /api/contractors
 * @Access Private ("create:contractors" permission, Admin)
 */

const createContractors = asyncHandler(async (req, res) => {
  const { contractor, contact, email, phone } = req.body;

  const contractorExists = await Contractor.find({ contractor: contractor });

  if (contractorExists.length < 1) {
    const createdContractor = await Contractor.create({ contractor: contractor, contact: contact, email: email, phone: phone });
    res.status(201);
    res.json({ message: 'success', contractor: createdContractor });
  } else {
    res.status(409);
    throw new Error('Contractor already exists');
  }
});

const getContractor = asyncHandler(async (req, res) => {
  const contractor = await Contractor.findById(req.params.id);

  if (contractor) {
    res.json(contractor);
  } else {
    res.status(404);
    throw new Error('Contractor not found');
  }
});

const updateContractor = asyncHandler(async (req, res) => {});

const deleteContractor = asyncHandler(async (req, res) => {});

module.exports = { getContractors, createContractors, getContractor, updateContractor, deleteContractor };

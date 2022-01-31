const express = require('express');
const router = express.Router();

const { getContractors, createContractors, getContractor, updateContractor, deleteContractor } = require('../controllers/contractorsController');
const { readContractorsAuth, createContractorsAuth, updateContractorsAuth, deleteContractorsAuth } = require('../middleware/authMiddleware');
const validation = require('../middleware/validatorMiddleware');
const { contractorSchema, contractorParams } = require('../middleware/validators/contractorsValidation');

router.route('/').get(readContractorsAuth, getContractors).post(createContractorsAuth, contractorSchema, validation, createContractors);
router
  .route('/:id')
  .get(readContractorsAuth, contractorParams, validation, getContractor)
  .put(updateContractorsAuth, contractorParams, contractorSchema, validation, updateContractor)
  .delete(deleteContractorsAuth, contractorParams, validation, deleteContractor);

module.exports = router;

const express = require('express');
const router = express.Router();

const { getContractors, createContractors, getContractor, updateContractor, deleteContractor } = require('../controllers/contractorsController');
const { readContractorsAuth, createContractorsAuth, updateContractorsAuth, deleteContractorsAuth } = require('../middleware/authMiddleware');
const validation = require('../middleware/validatorMiddleware');
const { contractorSchema, contractorParams } = require('../middleware/validators/contractorsValidation');
const { paginationQuery } = require('../middleware/validators/paginationQueryValidation');

router.route('/').get(readContractorsAuth, paginationQuery, validation, getContractors).post(createContractorsAuth, contractorSchema, validation, createContractors);
router
  .route('/:id')
  .get(readContractorsAuth, contractorParams, validation, getContractor)
  .put(updateContractorsAuth, contractorParams, contractorSchema, validation, updateContractor)
  .delete(deleteContractorsAuth, contractorParams, validation, deleteContractor);

module.exports = router;

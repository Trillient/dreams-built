const express = require('express');
const { getContractors, createContractors, getContractor, updateContractor, deleteContractor } = require('../controllers/contractorsController');
const { readContractorsAuth, createContractorsAuth, updateContractorsAuth, deleteContractorsAuth } = require('../middleware/authMiddleware');
const router = express.Router();

const validation = require('../middleware/validatorMiddleware');

router.route('/').get(readContractorsAuth, getContractors).post(createContractorsAuth, createContractors);
router.route('/:id').get(readContractorsAuth, getContractor).put(updateContractorsAuth, updateContractor).delete(deleteContractorsAuth, deleteContractor);

module.exports = router;

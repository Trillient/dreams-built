const express = require('express');
const router = express.Router();

const { getClients, getClient, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { readClients, writeClients } = require('../middleware/authMiddleware');
const { clientSchema, clientParams } = require('../middleware/validators/clientValidation');
const validation = require('../middleware/validatorMiddleware');

router.route('/').get(readClients, getClients).post(writeClients, clientSchema, validation, createClient);
router.route('/:id').get(readClients, clientParams, validation, getClient).put(writeClients, clientParams, clientSchema, validation, updateClient).delete(writeClients, clientParams, validation, deleteClient);

module.exports = router;

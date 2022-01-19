const express = require('express');
const router = express.Router();

const { getClients, getClient, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { readClientsAuth, createClientsAuth } = require('../middleware/authMiddleware');
const { clientSchema, clientParams } = require('../middleware/validators/clientValidation');
const validation = require('../middleware/validatorMiddleware');

router.route('/').get(readClientsAuth, getClients).post(createClientsAuth, clientSchema, validation, createClient);
router.route('/:id').get(readClientsAuth, clientParams, validation, getClient).put(createClientsAuth, clientParams, clientSchema, validation, updateClient).delete(createClientsAuth, clientParams, validation, deleteClient);

module.exports = router;

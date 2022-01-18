const express = require('express');
const router = express.Router();

const { getClients, getClient, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { readClients, createClients } = require('../middleware/authMiddleware');
const { clientSchema, clientParams } = require('../middleware/validators/clientValidation');
const validation = require('../middleware/validatorMiddleware');

router.route('/').get(readClients, getClients).post(createClients, clientSchema, validation, createClient);
router.route('/:id').get(readClients, clientParams, validation, getClient).put(createClients, clientParams, clientSchema, validation, updateClient).delete(createClients, clientParams, validation, deleteClient);

module.exports = router;

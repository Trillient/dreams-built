const express = require('express');
const router = express.Router();

const { getClients, getClient, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { readClients, writeClients } = require('../middleware/authMiddleware');
const { clientSchema } = require('../middleware/validators/clientValidation');
const validation = require('../middleware/validatorMiddleware');

router.route('/').get(readClients, getClients).post(writeClients, clientSchema, validation, createClient);
router.route('/:id').get(readClients, getClient).put(writeClients, clientSchema, validation, updateClient).delete(writeClients, deleteClient);

module.exports = router;

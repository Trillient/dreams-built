const express = require('express');

const router = express.Router();

const { getClients, getClient, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { readClients, writeClients } = require('../middleware/authMiddleware');

router.route('/').get(readClients, getClients).post(writeClients, createClient);
router.route('/:id').get(getClient).put(updateClient).delete(deleteClient);

module.exports = router;

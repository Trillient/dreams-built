const express = require('express');
const router = express.Router();

const { getClients, getClient, createClient } = require('../controllers/clientController');

router.route('/').get(getClients).post(createClient);
router.route('/:id').get(getClient);

module.exports = router;

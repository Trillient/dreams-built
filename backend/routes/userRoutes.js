const express = require('express');
const router = express.Router();

const { getUsers, createUser, getUser } = require('../controllers/userController');

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser);

module.exports = router;

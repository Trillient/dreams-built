const express = require('express');
const router = express.Router();

const { getUsers, createUser, getUser, updateUser, deleteUser, getUserProfile, updateUserProfile } = require('../controllers/userController');

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/profile/:id').get(getUserProfile).put(updateUserProfile);

module.exports = router;

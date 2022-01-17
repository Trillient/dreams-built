const express = require('express');
const router = express.Router();

const { getUsers, createUser, getUser, updateUser, deleteUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { checkJwt } = require('../middleware/authMiddleware');

router.route('/').get(checkJwt, getUsers).post(createUser);
router.route('/:id').get(checkJwt, getUser).put(checkJwt, updateUser).delete(checkJwt, deleteUser);
router.route('/profile/:id').get(checkJwt, getUserProfile).put(checkJwt, updateUserProfile);

module.exports = router;

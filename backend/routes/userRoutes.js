const express = require('express');
const router = express.Router();

const { getUsers, createUser, getUser, updateUser, deleteUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { checkJwt, readUsersAuth, updateUsersAuth, deleteUsersAuth, readProfileAuth, updateProfileAuth } = require('../middleware/authMiddleware');
const validation = require('../middleware/validatorMiddleware');
const { userSchema, userParams, userAdminUpdateSchema, userUpdateSchema } = require('../middleware/validators/userValidation');

// Admin
router.route('/').get(checkJwt, readUsersAuth, getUsers).post(userSchema, validation, createUser);
router
  .route('/:id')
  .get(checkJwt, readUsersAuth, userParams, validation, getUser)
  .put(checkJwt, updateUsersAuth, userParams, userUpdateSchema, userAdminUpdateSchema, validation, updateUser)
  .delete(checkJwt, deleteUsersAuth, userParams, validation, deleteUser);
// User
router.route('/profile/:id').get(checkJwt, readProfileAuth, getUserProfile).put(checkJwt, updateProfileAuth, userUpdateSchema, validation, updateUserProfile);

module.exports = router;

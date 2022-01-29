const asyncHandler = require('express-async-handler');
const axios = require('axios').default;
const User = require('../models/userModel');
const { domain, auth0ClientId, auth0ClientSecret, audience } = require('../config/env');

/**
 * @Desc Get a list of all users
 * @Route GET /api/users
 * @Access Private (admin user) //TODO add admin constraints
 */

const getUsers = asyncHandler(async (req, res) => {
  const userListMongo = await User.find();
  const body = { client_id: auth0ClientId, client_secret: auth0ClientSecret, audience: `https://${domain}/api/v2/`, grant_type: 'client_credentials' };

  const userList = userListMongo.map((user) => user.toObject());
  const options = {
    headers: { 'content-type': 'application/json' },
  };

  const token = await axios.post(`https://${domain}/oauth/token`, body, options);

  const config = {
    headers: { Authorization: `Bearer ${token.data.access_token}` },
  };
  const { data } = await axios.get(`https://${domain}/api/v2/users`, config);

  const mergedData = data.map((authUser) => ({ ...authUser, ...userList.find((dbUser) => dbUser.userId === authUser.user_id) }));

  res.json(mergedData);
});

/**
 * @Desc Create a user
 * @Route POST /api/users
 * @Access Public
 */

const createUser = asyncHandler(async (req, res) => {
  const { userId, firstName, lastName, birthDate, hourlyRate, startDate } = req.body;

  const user = await User.create({
    userId,
    firstName,
    lastName,
    birthDate,
    hourlyRate,
    startDate,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      hourlyRate: user.hourlyRate,
      startDate: user.startDate,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @Desc Get a user's details
 * @Route GET /api/users/:id
 * @Access Private (Admin) //TODO add admin constraints
 */

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

/**
 * @Desc Update a single user
 * @Route PUT /api/users/:id
 * @Access Private (only admin) //TODO add admin constraints
 */

const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, birthDate, hourlyRate } = req.body;

  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.birthDate = birthDate || user.birthDate;
    user.hourlyRate = hourlyRate || user.hourlyRate;

    await user.save();
    res.json(user);
  }
});

/**
 * @Desc Delete a single user
 * @Route DELETE /api/users/:id
 * @Access Private (only admin) //TODO add admin constraints
 */

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  }
});

/**
 * @Desc Get a user's profile
 * @Route GET /api/users/profile/:id
 * @Access Private
 */

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  //TODO cross check JWT with userID to confirm correct user

  const userProfile = {
    _id: user._id,
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isAdmin: user.isAdmin,
  };

  res.json(userProfile);
});

/**
 * @Desc Update a single user
 * @Route PUT /api/users/:id
 * @Access Private
 */

const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.hourlyRate = user.hourlyRate;

    await user.save();

    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { getUsers, createUser, getUser, updateUser, deleteUser, getUserProfile, updateUserProfile };

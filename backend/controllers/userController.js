const asyncHandler = require('express-async-handler');
const axios = require('axios').default;
const User = require('../models/userModel');
const { domain, auth0ClientId, auth0ClientSecret } = require('../config/env');

/**
 * @Desc Get a list of all users
 * @Route GET /api/users
 * @Access Private ("read:users", admin)
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
  const { userId, firstName, lastName, auth0Email } = req.body;

  const user = await User.findOne({ userId: userId });

  if (!user) {
    const newUser = {
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      auth0Email: auth0Email,
    };
    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @Desc Get a user's details
 * @Route GET /api/users/:id
 * @Access Private ("read:users", admin)
 */

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User does not exist');
  }
});

/**
 * @Desc Update a single user
 * @Route PUT /api/users/:id
 * @Access Private ("update:users" admin)
 */

const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, auth0Email, hourlyRate } = req.body;

  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.auth0Email = auth0Email;
    user.hourlyRate = hourlyRate;

    await user.save();
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @Desc Delete a single user
 * @Route DELETE /api/users/:id
 * @Access Private ("delete:users", admin)
 */

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
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

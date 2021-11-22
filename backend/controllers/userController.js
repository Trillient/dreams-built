const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * @Desc Get a list of all users
 * @Route GET /api/user
 * @Access Private (admin user) //TODO add admin constraints
 */

const getUsers = asyncHandler(async (req, res) => {
  const userList = await User.find();
  res.json(userList);
});

/**
 * @Desc Create a user
 * @Route POST /api/user
 * @Access Public
 */

const createUser = asyncHandler(async (req, res) => {
  const { userId, firstName, lastName, email, phoneNumber, isAdmin, birthDate, hourlyRate, startDate } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    userId,
    firstName,
    lastName,
    email,
    phoneNumber,
    isAdmin,
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
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
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

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @Desc Update a single user
 * @Route PUT /api/users/:id
 * @Access Private (only admin) //TODO add admin constraints
 */

const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNumber, isAdmin = false, birthDate, hourlyRate, startDate } = req.body;

  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.isAdmin = isAdmin || user.isAdmin;
    user.birthDate = birthDate || user.birthDate;
    user.hourlyRate = hourlyRate || user.hourlyRate;
    user.startDate = startDate || user.startDate;

    await user.save();
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

/**
 * @Desc Delete a single user
 * @Route DELETE /api/users/:id
 * @Access Private (only admin) //TODO add admin constraints
 */

const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: 'User removed' });
    }
  } catch (err) {
    if (err.message.indexOf('Cast to ObjectId failed') !== -1) {
      res.status(404);
      throw new Error('User not found');
    } else {
      next(err);
    }
  }
});

module.exports = { getUsers, createUser, getUser, updateUser, deleteUser };

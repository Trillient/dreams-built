const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * @Desc Get a list of all users
 * @Route GET /api/user
 * @Access Private (admin user) //TODO - make private
 */

const getUsers = asyncHandler(async (req, res) => {
  const userList = await User.find();
  res.json(userList);
});

/**
 * @Desc Create a user
 * @Route POST /api/user
 * @Access Private (admin user) //TODO - make private
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
 * @Access Private (user) //TODO - make private
 */

const getUser = asyncHandler(async (req, res) => {});

module.exports = { getUsers, createUser, getUser };

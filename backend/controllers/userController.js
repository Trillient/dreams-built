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
  const { firstName, lastName, email, isAdmin, birthDate, hourlyRate, startDate } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    isAdmin,
    birthDate,
    hourlyRate,
    startDate,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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

module.exports = { getUsers, createUser };

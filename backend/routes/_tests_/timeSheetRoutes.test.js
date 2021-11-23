const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');

const database = require('../../config/database');
const User = require('../../models/userModel');
const TimeSheet = require('../../models/timeSheetModel');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
});

const token = process.env.AUTH0_TEST_TOKEN;

const createNewUser = (userId, firstName, lastName, email = 'abc@gmail.com', phoneNumber = 2111111, isAdmin = false, birthDate = '10-10-2020', hourlyRate = 10, startDate = '10-01-2020') => {
  return {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    isAdmin: isAdmin,
    birthDate: birthDate,
    hourlyRate: hourlyRate,
    startDate: startDate,
  };
};

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
const clientId = process.env.AUTH0_CLIENT_ID;

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

const createTimeSheetEntry = (entries = [], weekStart = '21/10/2020', weekEnd = '27/10/2020') => {
  return {
    weekStart: weekStart,
    weekEnd: weekEnd,
    entries: entries,
  };
};

const createSingleEntry = (entryId = '1', day = 'Monday', date = '12/12/2021', startTime = '10:50am', endTime = '11:50am', jobNumber = 22001, jobTime = 1) => {
  return {
    entryId: entryId,
    day: day,
    date: date,
    startTime: startTime,
    endTime: endTime,
    jobNumber: jobNumber,
    jobTime: jobNumber,
  };
};

describe('Given we have an /api/timesheet/user/:id endpoint', () => {
  describe('and a POST method', () => {
    it('when a authenticated user makes a valid request then it should return a 201 response with the created data', async () => {
      // Create and save a user
      const newUser = createNewUser(clientId, 'mary', 'doe', 'mary@gmail.com');
      const row = new User(newUser);
      await row.save();

      // Retrieve user _id
      const user = await User.findOne({ email: 'mary@gmail.com' });
      const userParams = await user._id;

      // Create timesheet entry
      const singleEntry = createSingleEntry('2');
      const newTimeSheet = createTimeSheetEntry(singleEntry);

      // Check response
      const checkBody = (res) => {
        expect(res.body.userId).toBe(clientId);
        expect(res.body.entries[0].entryId).toBe('2');
      };

      // Make request
      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(201);
    });

    it('when a authenticated user makes a request to the wrong "/:id" endpoint then it should return 401 with an error message', async () => {
      // Create and save a user
      const newUser = createNewUser(2, 'craig', 'doe', 'craig@gmail.com');
      const row = new User(newUser);
      await row.save();

      // Retrieve user _id
      const user = await User.findOne({ email: 'craig@gmail.com' });
      const userParams = await user._id;

      // Create timesheet entry
      const singleEntry = createSingleEntry('3');
      const newTimeSheet = createTimeSheetEntry(singleEntry);

      // Check response
      const checkBody = (res) => {
        expect(res.body.message).toBe('Invalid user credentials');
      };

      // Make request
      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
  });
});

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');

const database = require('../../config/database');
const User = require('../../models/userModel');
const TimeSheetEntry = require('../../models/TimeSheetEntryModel');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany();
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

const createTimeSheetEntry = (entries = null, weekStart = '2021/12/14', weekEnd = '2021/12/20') => {
  return {
    weekStart: weekStart,
    weekEnd: weekEnd,
    entries: [entries],
  };
};

const createSingleEntry = (entryId = '1', day = 'Monday', date = '2021/12/14', startTime = '10:50am', endTime = '11:50am', jobNumber = 22001, jobTime = 10) => {
  return {
    entryId: entryId,
    day: day,
    date: date,
    startTime: startTime,
    endTime: endTime,
    jobNumber: jobNumber,
    jobTime: jobTime,
  };
};

const createReturnedEntry = (
  user,
  userId = clientId,
  entryId = '1',
  day = 'Monday',
  date = '2021/12/14',
  startTime = '10:50am',
  endTime = '11:50am',
  jobNumber = 22001,
  jobTime = 10,
  weekStart = '2021/12/14',
  weekEnd = '2021/12/20',
  isArchive = false
) => {
  return {
    user: user,
    userId: userId,
    entryId: entryId,
    day: day,
    date: date,
    startTime: startTime,
    endTime: endTime,
    jobNumber: jobNumber,
    jobTime: jobTime,
    weekStart: weekStart,
    weekEnd: weekEnd,
    isArchive,
  };
};

describe('Given we have an /api/timesheet/user/:id endpoint', () => {
  describe('and a GET method', () => {
    it("when an authenticated user makes a valid request then it should return a 200 response with the user's weekly entries", async () => {
      // Create and save a user
      const newUser = createNewUser(clientId, 'eric', 'doe', 'eric@gmail.com');
      const row = new User(newUser);
      await row.save();

      // Retrieve user _id
      const user = await User.findOne({ email: 'eric@gmail.com' });
      const userParams = await user._id;

      // Create timesheet entry
      await TimeSheetEntry.create(createReturnedEntry(userParams));

      // Check response
      const checkBody = (res) => {
        expect(res.body.entries[0].userId).toBe(clientId);
        expect(res.body.entries[0].entryId).toBe('1');
      };

      // Make request
      await request(app)
        .get(`/api/timesheet/user/${userParams}?weekstart=2021/12/14`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });
  describe('and a POST method', () => {
    it('when an authenticated user makes a valid request then it should return a 201 response with the created data', async () => {
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
        expect(res.body.entriesCreated).toBe(1);
        expect(res.body.entriesArchived).toBe(0);
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

    it('when an authenticated user makes a request to the wrong "/:id" endpoint then it should return 401 with an error message', async () => {
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

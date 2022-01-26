const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: createJWKSMock } = require('mock-jwks');

const database = require('../../config/database');
const { domain, audience } = require('../../config/env');
const User = require('../../models/userModel');
const TimesheetEntry = require('../../models/timesheetEntryModel');

const jwks = createJWKSMock(`https://${domain}/`);
const clientId = 'test|123456';
const token = jwks.token({
  aud: audience,
  iss: `https://${domain}/`,
  sub: clientId,
  permissions: ['read:timesheet', 'create:timesheet', 'admin_read:timesheet', 'admin_create:timesheet', 'admin_update:timesheet', 'admin_delete:timesheet'],
});

const createNewUser = (userId, firstName, lastName, auth0Email = 'abc@gmail.com', hourlyRate = 30) => {
  return {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    auth0Email: auth0Email,
    hourlyRate: hourlyRate,
  };
};

const createTimesheetEntry = (entries = null, weekStart = '2021/12/14', weekEnd = '2021/12/20') => {
  return {
    weekStart: weekStart,
    weekEnd: weekEnd,
    entries: [entries],
  };
};

const createSingleEntry = (entryId, day = 'Monday', date = '2021/12/14', startTime = '10:50am', endTime = '11:50am', jobNumber = 1, jobTime = 1) => {
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

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
  jwks.start();
  await User.create(createNewUser(clientId, 'eric', 'doe'));
});

afterEach(async () => {
  await TimesheetEntry.deleteMany();
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.disconnect();
  jwks.stop();
});

describe('Given we have an /api/timesheet/user/:id endpoint', () => {
  describe('When a GET request is made', () => {
    beforeEach(async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      await TimesheetEntry.create({
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        date: '2022-01-24',
        startTime: '11:00',
        endTime: '12:00',
        jobNumber: 2,
        jobTime: 1,
        weekStart: '2022-01-24',
        weekEnd: '2022-01-30',
      });
    });
    it("and is valid and authenticated, then a 200 response with the user's weekly entries are returned", async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = user.userId;

      const checkBody = (res) => {
        expect(res.body.entries).toBeTruthy();
        expect(res.body.entries[0].userId).toBe(clientId);
        expect(res.body.entries[0].entryId).toBe('9daf2326-c637-4761-8736-e68d36b33d3e');
        expect(res.body.entries.length).toBe(1);
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
        permissions: ['read:timesheet'],
      });

      await request(app)
        .get(`/api/timesheet/user/${userParams}?weekstart=2022-01-24`)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it('and has an invalid token, then a 401 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = user.userId;

      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: clientId,
        permissions: ['read:timesheet'],
      });

      await request(app)
        .get(`/api/timesheet/user/${userParams}?weekstart=2022-01-24`)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('and has insufficient permissions, then a 403 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = user.userId;

      const checkBody = (res) => {
        expect(res.body.error).toBe('Forbidden');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
      });

      await request(app)
        .get(`/api/timesheet/user/${userParams}?weekstart=2022-01-24`)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
    it('and there are no entries for the week, then a 200 response is returned with an empty array', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = user.userId;

      const checkBody = (res) => {
        expect(res.body.entries).toBeTruthy();
        expect(res.body.entries).toEqual([]);
      };

      await request(app)
        .get(`/api/timesheet/user/${userParams}?weekstart=2022-01-31`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it('and has an invalid "weekstart" query property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = user.userId;

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('invalid weekstart (yyyy-MM-dd)');
      };

      await request(app)
        .get(`/api/timesheet/user/${userParams}?weekstart=2022/01/24`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has no "weekstart" query property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = user.userId;

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('invalid weekstart (yyyy-MM-dd)');
      };

      await request(app)
        .get(`/api/timesheet/user/${userParams}`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has a ":id" parameter that does not exist, then a 404 response is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.message).toBe('User does not exist');
      };

      await request(app)
        .get(`/api/timesheet/user/invalidIdParam?weekstart=2022-01-24`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(404);
    });
  });
  describe.skip('and a POST method', () => {
    it('when an authenticated user makes a valid request then it should return a 201 response with the created data', async () => {
      // Create and save a user
      const newUser = createNewUser(clientId, 'mary', 'doe', 'mary@gmail.com');
      const row = new User(newUser);
      await row.save();

      // Retrieve user _id
      const user = await User.findOne({ email: 'mary@gmail.com' });
      const userParams = await user.userId;

      // Create timesheet entry
      const singleEntry = createSingleEntry('2');
      const newTimeSheet = createTimesheetEntry(singleEntry);

      // Check response
      const checkBody = (res) => {
        expect(res.body.entriesCreated).toBe(1);
        expect(res.body.entriesArchived).toBe(1);
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

    //TODO all POST reqs

    it.todo('when an authenticated user makes a request to the wrong "/:id" endpoint then it should return 401 with an error message');
  });

  //TODO all /admin GET,POST,PATCH,DELETE

  //TODO all /admin/archive DELETE
});

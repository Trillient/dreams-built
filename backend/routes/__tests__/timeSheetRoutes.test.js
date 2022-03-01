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

const createNewUser = (userId, firstName = 'John', lastName = 'Doe', auth0Email = 'abc@gmail.com', hourlyRate = 30) => {
  return {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    auth0Email: auth0Email,
    hourlyRate: hourlyRate,
  };
};

const createTimesheetEntry = (entries = null, weekStart = '24/01/2022', weekEnd = '30/01/2022') => {
  return {
    weekStart: weekStart,
    weekEnd: weekEnd,
    entries: [entries],
  };
};

const createSingleEntry = (entryId, day = 'Monday', job = { _id: '507f191e810c19729de860eb', jobNumber: 1 }, startTime = '10:50', endTime = '11:50', jobTime = 1) => {
  return {
    entryId: entryId,
    day: day,
    job: job,
    startTime: startTime,
    endTime: endTime,
    jobNumber: job,
    jobTime: jobTime,
  };
};

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
  jwks.start();
  await User.create(createNewUser(clientId, 'eric', 'doe'));
});

beforeEach(async () => {
  const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
  await TimesheetEntry.create({
    user: user._id,
    userId: clientId,
    entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
    job: '507f191e810c19729de860ea',
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:00',
    jobNumber: 2,
    jobTime: 1,
    weekStart: '24/01/2022',
    weekEnd: '30/01/2022',
  });
});

afterEach(async () => {
  await TimesheetEntry.deleteMany();
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.disconnect();
  await jwks.stop();
});

describe('Given we have an /api/timesheet/user/:id endpoint', () => {
  describe('When a GET request is made', () => {
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
        .get(`/api/timesheet/user/${userParams}?weekstart=24/01/2022`)
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
        .get(`/api/timesheet/user/${userParams}?weekstart=24/01/2022`)
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
        .get(`/api/timesheet/user/${userParams}?weekstart=24/01/2022`)
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
        .get(`/api/timesheet/user/${userParams}?weekstart=31/01/2022`)
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
        expect(res.body.errors[0].msg).toBe('invalid weekstart (dd/MM/yyyy)');
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
        expect(res.body.errors[0].msg).toBe('invalid weekstart (dd/MM/yyyy)');
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
        .get(`/api/timesheet/user/invalidIdParam?weekstart=24/01/2022`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(404);
    });
  });
  describe('When a POST request is made,', () => {
    it('and is valid, authenticated and appropriately authorized, then it should return a 201 response with the created data', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = createSingleEntry('9daf2326-c637-4761-8736-e68d36b33d3e');
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.entriesCreated).toBe(1);
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
        permissions: ['create:timesheet'],
      });

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(201);
    });
    it('and has an invalid token, then a 401 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = createSingleEntry('9daf2326-c637-4761-8736-e68d36b33d3e');
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: clientId,
        permissions: ['create:timesheet'],
      });

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('and has insufficient permissions, then a 403 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = createSingleEntry('9daf2326-c637-4761-8736-e68d36b33d3e');
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.error).toBe('Forbidden');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
      });

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });

    it('and has an ":id" parameter that does not exist, then a 404 response is returned', async () => {
      const singleEntry = createSingleEntry('9daf2326-c637-4761-8736-e68d36b33d3e');
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.message).toBe('Invalid user');
      };

      await request(app)
        .post(`/api/timesheet/user/invalidclientparam`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(404);
    });
    it('and does not have "entryId" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = createSingleEntry();
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Vaild entry id required');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has an invalid "entryId" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = createSingleEntry('2x');
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Vaild entry id required');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has an invalid "day" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'xxx',
        startTime: '11:00',
        endTime: '12:00',
        jobNumber: 2,
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Day must be a valid weekday, ie(Monday)');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and is missing the "day" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        startTime: '11:00',
        endTime: '12:00',
        jobNumber: 2,
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Day must be a valid weekday, ie(Monday)');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has an invalid "startTime" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        startTime: '1:00',
        endTime: '12:00',
        jobNumber: 2,
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Start time invalid, "HH:MM" format required');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and is missing the "startTime" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        endTime: '12:00',
        jobNumber: 2,
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Start time invalid, "HH:MM" format required');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has an invalid "endTime" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        endTime: '12:00PM',
        startTime: '12:00',
        jobNumber: 2,
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('End time invalid, "HH:MM" format required');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and is missing the "endTime" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        startTime: '12:00',
        jobNumber: 2,
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('End time invalid, "HH:MM" format required');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });

    it('and has an invalid "jobTime" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        endTime: '11:00',
        startTime: '12:00',
        job: { _id: '507f191e810c19729de860ea', jobNumber: 2 },
        jobTime: 'f1',
      };
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Job time invalid');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and is missing the "jobTime" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        endTime: '11:00',
        startTime: '12:00',
        job: { _id: '507f191e810c19729de860ea', jobNumber: 2 },
      };
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Job time invalid');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and the "jobTime" property is greater than 24, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        endTime: '11:00',
        startTime: '12:00',
        job: { _id: '507f191e810c19729de860ea', jobNumber: 2 },
        jobTime: 'f1',
      };
      const newTimeSheet = createTimesheetEntry(singleEntry);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Job time invalid');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has an invalid "weekStart" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        endTime: '11:00',
        startTime: '12:00',
        job: { _id: '507f191e810c19729de860ea', jobNumber: 2 },
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry, '20-20-2020');

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Week Start value invalid (dd/MM/yyyy)');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and is missing the "weekStart" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        endTime: '11:00',
        startTime: '12:00',
        job: { _id: '507f191e810c19729de860ea', jobNumber: 2 },
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry, null);

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Week Start value invalid (dd/MM/yyyy)');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has an invalid "weekEnd" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        endTime: '11:00',
        startTime: '12:00',
        job: { _id: '507f191e810c19729de860ea', jobNumber: 2 },
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry, '24/01/2022', '2022/01/24');

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Week End value invalid (dd/MM/yyyy)');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and is missing the "weekEnd" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
      const userParams = await user.userId;

      const singleEntry = {
        user: user._id,
        userId: clientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        endTime: '11:00',
        startTime: '12:00',
        job: { _id: '507f191e810c19729de860ea', jobNumber: 2 },
        jobTime: 1,
      };
      const newTimeSheet = createTimesheetEntry(singleEntry, '24/01/2022', '');

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Week End value invalid (dd/MM/yyyy)');
      };

      await request(app)
        .post(`/api/timesheet/user/${userParams}`)
        .send(newTimeSheet)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
  });
});

describe('Given we have an /api/timesheet/admin endpoint', () => {
  describe('When a GET request is made', () => {
    const secondClientId = 'alpha|123456';
    beforeAll(async () => {
      await User.create(createNewUser(secondClientId, 'alpha', 'doe', 'alpha@gmail.com'));
      const secondUser = await User.findOne({ auth0Email: 'alpha@gmail.com' });
      await TimesheetEntry.create({
        user: secondUser._id,
        userId: secondClientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        startTime: '11:00',
        endTime: '12:00',
        jobNumber: 2,
        job: '507f191e810c19729de860ea',
        jobTime: 1,
        weekStart: '24/01/2022',
        weekEnd: '30/01/2022',
      });
      await TimesheetEntry.create({
        user: secondUser._id,
        userId: secondClientId,
        entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
        day: 'Monday',
        startTime: '11:00',
        endTime: '12:00',
        jobNumber: 2,
        job: '507f191e810c19729de860ea',
        jobTime: 1,
        weekStart: '31/01/2022',
        weekEnd: '06/02/2022',
      });
    });
    it('and is valid, authenticated and appropriately authorized, then it returns the entries with the applicable weekstart period and a 200 response', async () => {
      const checkBody = (res) => {
        expect(res.body.jobs[0].weekStart).toBe('24/01/2022');
        expect(res.body.jobs.length).toBe(2);
        expect(res.body.jobs[0].userId).not.toBe(res.body.jobs[1].userId);
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
        permissions: ['admin_read:timesheet'],
      });

      await request(app)
        .get(`/api/timesheet/admin?weekstart=24/01/2022`)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it('and has an invaid token, then it returns a 401 response', async () => {
      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: clientId,
        permissions: ['admin_read:timesheet'],
      });

      await request(app)
        .get(`/api/timesheet/admin?weekstart=24/01/2022`)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('and has insufficient permissions, then it returns a 403 response', async () => {
      const checkBody = (res) => {
        expect(res.body.error).toBe('Forbidden');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
      });

      await request(app)
        .get(`/api/timesheet/admin?weekstart=24/01/2022`)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
    it('and has an invalid "weekstart" query property, then a 400 response is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('invalid weekstart (dd/MM/yyyy)');
      };

      await request(app)
        .get(`/api/timesheet/admin?weekstart=01/31/2022`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has no "weekstart" query property, then a 400 response is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('invalid weekstart (dd/MM/yyyy)');
      };

      await request(app)
        .get(`/api/timesheet/admin`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has a valid "weekstart" property that has no data, then an empty array is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.jobs).toEqual([]);
        expect(res.body.entries).toEqual([]);
      };

      await request(app)
        .get(`/api/timesheet/admin?weekstart=31/01/2022`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });
});
describe('Given we have an /api/timesheet/admin/users/:id endpoint', () => {
  describe('When a PATCH request is made', () => {
    test.skip('and is valid, authenticated and appropriately authorized, then it updates the entry and a 200 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });
      const timesheetUpdates = {
        startTime: '18:00',
        endTime: '19:30',
        jobTime: 1.5,
        job: { jobNumber: 30, _id: '507f191e810c19729de860ea' },
      };

      const checkBody = (res) => {
        console.log(res.body);
        expect(res.body).toEqual();
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: 'admin|123456',
        permissions: ['admin_update:timesheet'],
      });

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it('and has an invalid token, then a 401 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });
      const timesheetUpdates = {
        startTime: '18:00',
        endTime: '19:30',
        jobNumber: 30,
        jobTime: 1.5,
      };

      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: 'admin|123456',
        permissions: ['admin_update:timesheet'],
      });

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('and has insufficient permissions, then a 403 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });
      const timesheetUpdates = {
        startTime: '18:00',
        endTime: '19:30',
        jobNumber: 30,
        jobTime: 1.5,
      };

      const checkBody = (res) => {
        expect(res.body.error).toBe('Forbidden');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: 'admin|123456',
      });

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
    it('and has an invalid "startTime" property, then a 400 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });
      const timesheetUpdates = {
        startTime: '1800',
        endTime: '19:30',
        jobNumber: 30,
        jobTime: 1.5,
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Start time invalid, "HH:MM" format required');
      };

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has a missing "startTime" property, then a 400 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });
      const timesheetUpdates = {
        endTime: '19:30',
        jobNumber: 30,
        jobTime: 1.5,
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Start Time is missing');
      };

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has an invalid "endTime" property, then a 400 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });
      const timesheetUpdates = {
        startTime: '18:00',
        endTime: '1930',
        jobNumber: 30,
        jobTime: 1.5,
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('End time invalid, "HH:MM" format required');
      };

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('and has a missing "endTime" property, then a 400 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });
      const timesheetUpdates = {
        startTime: '18:00',
        jobNumber: 30,
        jobTime: 1.5,
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('End Time is missing');
      };

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });

    it('and has a missing "job" property, then a 400 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });
      const timesheetUpdates = {
        startTime: '18:00',
        endTime: '19:30',
        jobTime: 1.5,
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Job Number is missing');
      };

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });

    it('and has no ":id" parameter, then a 404 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });
      const timesheetUpdates = {
        startTime: '18:00',
        endTime: '19:30',
        jobNumber: 30,
        jobTime: 1.5,
      };

      const checkBody = (res) => {
        expect(res.body.message).toBe('Not Found - /api/timesheet/admin/users/entry/');
      };

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(404);
    });
    it('and has an invalid":id" parameter, then a 400 reponse is returned', async () => {
      const timesheetUpdates = {
        startTime: '18:00',
        endTime: '19:30',
        jobNumber: 30,
        jobTime: 1.5,
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Invalid entry id parameter');
      };

      await request(app)
        .patch(`/api/timesheet/admin/users/entry/{timesheetEntry._id}`)
        .send(timesheetUpdates)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
  });
  describe('When a DELETE request is made', () => {
    it('and is both valid and authorized, then the entry is deleted and a 200 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });

      const checkBody = (res) => {
        expect(res.body.message).toBe('Entry Deleted');
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: 'admin|123456',
        permissions: ['admin_delete:timesheet'],
      });

      await request(app)
        .delete(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it('and has an invalid token, then a 401 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });

      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: 'admin|123456',
        permissions: ['admin_delete:timesheet'],
      });

      await request(app)
        .delete(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('and has insufficient permissions, then a 403 response is returned', async () => {
      const timesheetEntry = await TimesheetEntry.findOne({ userId: clientId });

      const checkBody = (res) => {
        expect(res.body.error).toBe('Forbidden');
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: 'admin|123456',
      });

      await request(app)
        .delete(`/api/timesheet/admin/users/entry/${timesheetEntry._id}`)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
    it('and has an "id" parameter that does not exist, then a 404 response is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.message).toBe('Entry not found');
      };

      await request(app)
        .delete(`/api/timesheet/admin/users/entry/507f191e810c19729de860ea`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(404);
    });
    it('and has an invalid "id" parameter, then a 400 repsonse is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Invalid entry id parameter');
      };

      await request(app)
        .delete(`/api/timesheet/admin/users/entry/29de860ea`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
  });
});

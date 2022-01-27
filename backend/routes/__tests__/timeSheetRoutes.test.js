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

const createSingleEntry = (entryId, day = 'Monday', startTime = '10:50', endTime = '11:50', jobNumber = 1, jobTime = 1) => {
  return {
    entryId: entryId,
    day: day,
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

beforeEach(async () => {
  const user = await User.findOne({ auth0Email: 'abc@gmail.com' });
  await TimesheetEntry.create({
    user: user._id,
    userId: clientId,
    entryId: '9daf2326-c637-4761-8736-e68d36b33d3e',
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
  jwks.stop();
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
        expect(res.body.entriesArchived).toBe(1);
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

    it.todo('and has an invalid token, then a 401 response is returned');
    it.todo('and has insufficient permissions, then a 403 response is returned');
    it.todo('and has an invalid ":id" parameter property, then a 400 response is returned');
    it.todo('and has an ":id" parameter that does not exist, then a 404 response is returned');
    it.todo('and does not have "entryId" property, then a 400 response is returned');
    it.todo('and has an invalid "entryId" property, then a 400 response is returned');
    it.todo('and has an invalid "day" property, then a 400 response is returned');
    it.todo('and is missing the "day" property, then a 400 response is returned');
    it.todo('and has an invalid "startTime" property, then a 400 response is returned');
    it.todo('and is missing the "startTime" property, then a 400 response is returned');
    it.todo('and has an invalid "endTime" property, then a 400 response is returned');
    it.todo('and is missing the "endTime" property, then a 400 response is returned');
    it.todo('and has an invalid "jobNumber" property, then a 400 response is returned');
    it.todo('and is missing the "jobNumber" property, then a 400 response is returned');
    it.todo('and the "jobNumber" property is negative, then a 400 response is returned');
    it.todo('and has an invalid "jobTime" property, then a 400 response is returned');
    it.todo('and is missing the "jobTime" property, then a 400 response is returned');
    it.todo('and the "jobTime" property is greater than 24, then a 400 response is returned');
    it.todo('and has an invalid "weekStart" property, then a 400 response is returned');
    it.todo('and is missing the "weekStart" property, then a 400 response is returned');
    it.todo('and has an invalid "weekEnd" property, then a 400 response is returned');
    it.todo('and is missing the "weekEnd" property, then a 400 response is returned');
  });
});

describe('Given we have an /api/timesheet/admin endpoint', () => {
  describe('When a GET request is made', () => {});
  describe('When a POST request is made', () => {});
  describe('When a PATCH request is made', () => {});
  describe('When a DELETE request is made', () => {});
});

describe('Given we have an /api/timesheet/admin/archive endpoint', () => {
  describe('When a DELETE request is made', () => {});
});

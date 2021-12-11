const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');

const database = require('../../config/database');
const JobDetails = require('../../models/jobModel');
const Client = require('../../models/clientModel');
const JobPart = require('../../models/jobPartModel');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
  await Client.create({ clientName: 'warehouse' });
});

afterAll(async () => {
  await mongoose.disconnect();
});

const token = process.env.AUTH0_TEST_TOKEN;

const createNewJob = (jobId, client, due = []) => {
  return {
    jobNumber: jobId,
    client: client,
    address: 'address',
    city: 'hamilton',
    endClient: 'magre',
    area: 220.3,
    isInvoiced: false,
    dueDates: due,
  };
};

describe('Given we have an "/api/job/details" endpoint', () => {
  describe('and make a GET request, ', () => {
    it('When a valid request is made then a 200 response with a list of jobs should be returned', async () => {
      const getClientName = await Client.findOne({ clientName: 'warehouse' });
      for (let jobId = 22001; jobId < 22003; jobId++) {
        const newJob = createNewJob(jobId, getClientName._id);
        const row = new JobDetails(newJob);
        await row.save();
      }

      const checkBody = (res) => {
        expect(res.body.length).toBe(2);
      };

      await request(app)
        .get('/api/job/details/')
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });

    it('When a request is made without a correct access token, then an error 403', async () => {
      const checkBody = (res) => {
        expect(res.body.message).toBe('invalid token');
      };

      await request(app)
        .get('/api/job/details/')
        .set(`Authorization`, `Bearer n${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
  });

  describe('and make a POST request, ', () => {
    it('When a valid request is made then a 201 respose should be returned', async () => {
      const getClientName = await Client.findOne({ clientName: 'warehouse' });
      const newJob = createNewJob(22004, getClientName._id);
      await request(app)
        .post('/api/job/details')
        .send(newJob)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(201);
    });

    it('When a request is made with a job number that already exists then a 400 respose with an error message should be returned', async () => {
      const newJob = createNewJob(22004);

      const checkBody = (res) => {
        expect(res.body.message).toBe('Job Number already exists!');
        expect(res.body.statusCode).toBe(400);
      };

      await request(app)
        .post('/api/job/details')
        .send(newJob)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
  });
});

describe('Given we have an "/api/jobdetails/:id" endpoint', () => {
  it("When a valid GET request is made then the job's details are returned with a 200 response", async () => {
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = await job._id;

    const checkBody = (res) => {
      expect(res.body.jobNumber).toBe(22001);
    };

    await request(app)
      .get(`/api/job/details/${jobParams}`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });

  it('When a valid PUT request is made then the jobs details are updated and returned with a 200 response', async () => {
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = await job._id;

    updatedJob = {
      client: job.client,
      city: 'Auckland',
    };

    const checkBody = (res) => {
      console.log(res.body);
      expect(res.body.jobNumber).toBe(22001);
      expect(res.body.city).toBe('Auckland');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });

  it('When a valid DELETE request is made then the jobs details are deleted and returned with a 200 response', async () => {
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = await job._id;

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job removed');
    };

    await request(app)
      .delete(`/api/job/details/${jobParams}`)
      .send(jobParams)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
});

describe('Given we have an /api/job/parts endpoint', () => {
  it('when a user makes a valid GET request then it should return a list of job parts', async () => {
    await JobPart.create({ jobPartTitle: 'Schedule' });

    const checkBody = (res) => {
      console.log(res.body);
      expect(res.body.length).toBe(1);
    };

    await request(app)
      .get('/api/job/parts/')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it.todo('when a user makes a valid POST request then the job part should be saved and returned');
});

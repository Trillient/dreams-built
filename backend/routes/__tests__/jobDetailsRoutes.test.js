const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');

const database = require('../../config/database');
const JobDetails = require('../../models/jobModel');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
});

const token = process.env.AUTH0_TEST_TOKEN;

const createNewJob = (jobId, company = 'warehouse', due = []) => {
  return {
    jobNumber: jobId,
    company: company,
    address: 'address',
    city: 'hamilton',
    client: 'magre',
    area: 220.3,
    isInvoiced: false,
    dueDates: due,
  };
};

describe('Given we have an "/api/jobdetails" endpoint', () => {
  describe('and make a GET request, ', () => {
    it('When a valid request is made then a 200 response with a list of jobs should be returned', async () => {
      for (let jobId = 22001; jobId < 22003; jobId++) {
        const newJob = createNewJob(jobId);
        const row = new JobDetails(newJob);
        await row.save();
      }

      const checkBody = (res) => {
        expect(res.body.length).toBe(2);
      };

      await request(app)
        .get('/api/jobdetails/')
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
        .get('/api/jobdetails/')
        .set(`Authorization`, `Bearer t${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
  });

  describe('and make a POST request, ', () => {
    it('When a valid request is made then a 201 respose should be returned', async () => {
      const newJob = createNewJob(22004);
      await request(app)
        .post('/api/jobdetails')
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
        .post('/api/jobdetails')
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
  describe('And make a GET request', () => {
    it("When a valid request is made then the job's details are returned with a 200 response", async () => {
      const job = await JobDetails.find({ jobNumber: 22001 });
      const jobParams = await job[0]._id;

      const checkBody = (res) => {
        expect(res.body.jobNumber).toBe(22001);
      };

      await request(app)
        .get(`/api/jobdetails/${jobParams}`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });

  describe('And make a PUT request', () => {
    it('When a valid request is made then the jobs details are updated and returned with a 200 response', async () => {
      const job = await JobDetails.find({ jobNumber: 22001 });
      const jobObject = job[0];
      const jobParams = await jobObject._id;

      updatedJob = {
        city: 'Auckland',
        client: 'timmy',
      };

      const checkBody = (res) => {
        expect(res.body.jobNumber).toBe(22001);
        expect(res.body.city).toBe('Auckland');
        expect(res.body.client).toBe('timmy');
      };

      await request(app)
        .put(`/api/jobdetails/${jobParams}`)
        .send(updatedJob)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });

  describe('And make a DELETE request', () => {
    it('When a valid request is made then the jobs details are deleted and returned with a 200 response', async () => {
      const job = await JobDetails.find({ jobNumber: 22001 });
      const jobObject = job[0];
      const jobParams = await jobObject._id;

      const checkBody = (res) => {
        expect(res.body.message).toBe('Job removed');
      };

      await request(app)
        .delete(`/api/jobdetails/${jobParams}`)
        .send(jobParams)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });
});

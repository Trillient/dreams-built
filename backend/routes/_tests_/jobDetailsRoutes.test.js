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

describe('Given we have a GET /api/jobdetails endpoint', () => {
  it('When a valid request is made then a 200 response with a list of jobs should be returned', async () => {
    for (let jobId = 22001; jobId < 22003; jobId++) {
      const newJob = createNewJob(jobId);
      const row = new JobDetails(newJob);
      row.save();
    }

    const checkBody = (res) => {
      expect(res.body.length).toBe(2);
    };

    await request(app)
      .get('/api/jobdetails/')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
});

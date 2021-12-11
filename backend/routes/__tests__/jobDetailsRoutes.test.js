const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');

const database = require('../../config/database');
const JobDetails = require('../../models/jobModel');
const Client = require('../../models/clientModel');
const JobPart = require('../../models/jobPartModel');
const { findOne } = require('../../models/jobModel');
const JobDueDate = require('../../models/jobPartDueDateModel');

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
  it('When a valid GET request is made then a 200 response with a list of jobs should be returned', async () => {
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

  it('When a GET request is made without a valid token, then the user should recieve an error 403 response', async () => {
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

  it('When a valid POST request is made then a 201 respose should be returned', async () => {
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

  it('When a POST request is made with a job number that already exists then a 400 respose with an error message should be returned', async () => {
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

describe('Given we have an "/api/job/parts" endpoint', () => {
  it('when a user makes a valid GET request then it should return a list of job parts', async () => {
    await JobPart.create({ jobPartTitle: 'Schedule' });

    const checkBody = (res) => {
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
  it('when a user makes a valid POST request then the job part should be saved and returned', async () => {
    const jobPart = {
      jobPartTitle: 'Box-up',
      jobDescription: 'Sturcturally sercure the floor footing',
    };

    const checkBody = (res) => {
      expect(res.body).toEqual(expect.objectContaining(jobPart));
    };

    await request(app)
      .post('/api/job/parts/')
      .send(jobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(201);
  });
});

describe('Given we have an "/api/job/parts/:id" endpoint', () => {
  it('When a user makes a valid GET request then it should respond with a 200 code and the job part', async () => {
    const jobPart = {
      jobPartTitle: 'make soup',
    };

    await JobPart.create(jobPart);

    const savedJobPart = await JobPart.findOne(jobPart);

    const checkBody = (res) => {
      expect(res.body).toEqual(expect.objectContaining(jobPart));
    };

    await request(app)
      .get(`/api/job/parts/${savedJobPart._id}`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a user makes a GET request with a jobPart that does not exist then it should respond with a 404 code and an error', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Resource not found');
    };

    await request(app)
      .get(`/api/job/parts/incorrectId`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a valid PUT request is made then the jobs part is updated and returned with a 200 response', async () => {
    await JobPart.create({ jobPartTitle: 'go shopping' });

    const jobPart = await JobPart.findOne({ jobPartTitle: 'go shopping' });

    updatedJobPart = {
      jobPartTitle: 'call owners',
    };

    const checkBody = (res) => {
      expect(res.body.jobPartTitle).toBe(updatedJobPart.jobPartTitle);
    };

    await request(app)
      .put(`/api/job/parts/${jobPart._id}`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });

  it('When a valid DELETE request is made then the jobs part is deleted and returned with a 200 response', async () => {
    await JobPart.create({ jobPartTitle: 'make calls' });

    const jobPart = await JobPart.findOne({ jobPartTitle: 'make calls' });

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job part removed');
    };

    await request(app)
      .delete(`/api/job/parts/${jobPart._id}`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
});

describe('Given we have a "/api/job/parts/duedates" endpoint', () => {
  beforeAll(async () => {
    await Client.create({ clientName: 'Coca-cola' });
    const clientId = await Client.findOne({ clientName: 'Coca-cola' });
    await JobDetails.create(createNewJob(23000, clientId._id));
    await JobPart.create({ jobPartTitle: 'strip walls' });
  });
  it('When a valid and authenticated GET request is made, then a 200 respose with all due dates is recieved', async () => {
    const databaseJob = await JobDetails.findOne({ clientName: 'Coca-cola' });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    await JobDueDate.create({
      job: databaseJob._id,
      jobDescription: databaseJobPart._id,
      dueDate: '11/12/2021',
    });

    const checkBody = (res) => {
      expect(res.body.length).toBe(1);
    };

    await request(app)
      .get('/api/job/parts/duedates')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
});

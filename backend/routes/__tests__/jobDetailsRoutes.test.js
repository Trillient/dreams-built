const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: createJWKSMock } = require('mock-jwks');

const database = require('../../config/database');
const { domain, audience } = require('../../config/env');
const JobDetails = require('../../models/jobModel');
const Client = require('../../models/clientModel');
const JobPart = require('../../models/jobPartModel');
const JobDueDate = require('../../models/jobPartDueDateModel');
const Contractor = require('../../models/contractorModel');
const { findOne } = require('../../models/clientModel');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
  jwks.start();
});

beforeEach(async () => {
  await Client.create({ clientName: 'warehouse' });
});

afterEach(async () => {
  await Client.deleteMany();
  await JobDetails.deleteMany();
});

afterAll((done) => {
  jwks.stop();
  mongoose.connection.close();
  done();
});

const jwks = createJWKSMock(`https://${domain}/`);
const token = jwks.token({
  aud: audience,
  iss: `https://${domain}/`,
  sub: 'test|123456',
  permissions: ['read:jobs', 'create:jobs', 'update:jobs', 'delete:jobs', 'read:job_parts', 'create:job_parts', 'update:job_parts', 'delete:job_parts', 'create:due_dates', 'read:due_dates', 'update:due_dates', 'delete:due_dates'],
});

const createNewJob = (jobId, client, address = '12 abc lane', city = 'hamilton', area = 10, endClient = 'barney', color = '#bc12bc', isInvoiced = false) => {
  return {
    jobNumber: jobId,
    client: client,
    address: address,
    city: city,
    area: area,
    endClient: endClient,
    color: color,
    isInvoiced: isInvoiced,
  };
};

/**
 * @endpoint - /api/job/details
 * @paths - GET, POST
 */

describe('Given we have an "/api/job/details" endpoint', () => {
  it('When a GET request is valid, authenticated and appropriately authorized, then a 200 response with a list of jobs should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    for (let jobId = 22000; jobId < 22020; jobId++) {
      const newJob = createNewJob(jobId, getClient._id, `${jobId} abc lane`);
      await JobDetails.create(newJob);
    }

    const checkBody = (res) => {
      expect(res.body.jobList.length).toBe(20);
      expect(res.body.jobList[0].client.clientName).toBe('warehouse');
      expect(res.body.pages).toBe(1);
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:jobs',
    });

    await request(app)
      .get('/api/job/details')
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request is made without a valid token, then the user should receive an error 401 response', async () => {
    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://domain/`,
      sub: 'test|123456',
      permissions: 'read:jobs',
    });

    await request(app)
      .get('/api/job/details/')
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a GET request is made without the required permissions, then the user should receive an error 403 response', async () => {
    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .get('/api/job/details/')
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a GET request is made and there are no saved jobs, then the user should recieve a 200 response with an empty array', async () => {
    const checkBody = (res) => {
      expect(res.body.jobList).toEqual([]);
    };

    await request(app)
      .get('/api/job/details/')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a POST request is made and is valid, authenticated and appropriately authorized, then a 201 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id);

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job Created');
      expect(res.body.createdJob).toEqual(expect.objectContaining({ jobNumber: 22004 }));
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'create:jobs',
    });

    await request(app)
      .post('/api/job/details')
      .send(newJob)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(201);
  });
  it('When a POST request is made with only required fields, then a 201 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = {
      jobNumber: 1,
      client: getClient._id,
      color: '#bc12bc',
      address: '123 above lane',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job Created');
      expect(res.body.createdJob).toEqual(expect.objectContaining({ jobNumber: 1, color: '#bc12bc', isInvoiced: false }));
    };

    await request(app)
      .post('/api/job/details')
      .send(newJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(201);
  });
  it('When a POST request is made with a job number that already exists then a 400 response with an error message should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id);

    await JobDetails.create(newJob);

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
  it('When a POST request is not appropriately authorized, then a 403 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id);

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .post('/api/job/details')
      .send(newJob)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a POST request has no authorization token, then a 401 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id);

    const checkBody = (res) => {
      expect(res.body.message).toBe('No authorization token was found');
    };

    await request(app)
      .post('/api/job/details')
      .send(newJob)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a POST request is made with an invalid "jobNumber", then a 400 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob('g22004', getClient._id);

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Job number must be a valid number');
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
  it('When a POST request is made with a "client" that does not exist, then a 400 response should be returned', async () => {
    const newJob = createNewJob(2, '507f191e810c19729de860ea');

    const checkBody = (res) => {
      expect(res.body.message).toBe('Client does not exist');
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
  it('When a POST request is made with an incorrect "client" value, then a 400 response should be returned', async () => {
    const newJob = createNewJob(2, 25520);

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid client field');
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
  it('When a POST request is made with a missing "client" value, then a 400 response should be returned', async () => {
    const newJob = createNewJob(2);

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Missing Client');
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
  it('When a POST request is made with an invalid "address" field, then a 400 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id, 21000);

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Address must be valid');
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

  it('When a POST request is maded with an invalid "city" field, then a 400 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id, '12 Abe ave', 111);

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('City must be valid');
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
  it('When a POST request is maded with an invalid "area" field, then a 400 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id, '12 Abe ave', 'johnsenville', '12abv');

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Area must be a number');
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
  it('When a POST request is maded with an invalid "endClient" field, then a 400 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id, '12 Abe ave', 'johnsenville', 120, { client: 'name' });

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('End Client must be valid');
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
  it('When a POST request is maded with an invalid "color" field, then a 400 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id, '12 Abe ave', 'johnsenville', 120, 'yahoo', 'favev');

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Color must be entered as a Hex value');
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
  it('When a POST request is maded with an invalid "isInvoiced" field, then a 400 response should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    const newJob = createNewJob(22004, getClient._id, '12 Abe ave', 'johnsenville', 120, 'yahoo', '#ba2f', 1);

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invoiced must be a boolean value');
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

/**
 * @endpoint - /api/job/details/:id
 * @paths - GET, PUT, DELETE
 */

describe('Given we have an "/api/job/details/:id" endpoint', () => {
  it("When a GET request is valid, and appropriately authorized then the job's details are returned with a 200 response", async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(22001, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = await job._id;

    const checkBody = (res) => {
      expect(res.body.jobNumber).toBe(22001);
      expect(res.body.client.clientName).toBe(getClient.clientName);
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:jobs',
    });

    await request(app)
      .get(`/api/job/details/${jobParams}`)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request is not appropriately authorized then a 403 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(22001, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = await job._id;

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .get(`/api/job/details/${jobParams}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });

  it('When a GET request has an invalid token, then a 401 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(22001, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = await job._id;

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://domain/`,
      sub: 'test|123456',
      permissions: 'read:jobs',
    });

    await request(app)
      .get(`/api/job/details/${jobParams}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a GET request is made with an "id" param that does not exist, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Job does not exist');
    };

    await request(app)
      .get(`/api/job/details/507f1f77bcf86cd799439011`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a GET request is made with an incorrect "id" param, then a 400 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid id parameter');
    };

    await request(app)
      .get(`/api/job/details/randomId`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });

  it('When a PUT request is valid, authenticated and appropriately authorized request is made then the jobs details are updated and returned with a 200 response', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(22001, getClient._id, '12b acb lane', 'Hamilton'));
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = await job._id;

    updatedJob = {
      jobNumber: 22002,
      client: job.client,
      city: 'Auckland',
      address: '12b acb lane',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.jobNumber).toBe(22002);
      expect(res.body.city).toBe('Auckland');
      expect(res.body.city).not.toBe(job.city);
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'update:jobs',
    });

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a PUT request has an invalid token, then a 401 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(22001, getClient._id, '12b acb lane', 'Hamilton'));
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = await job._id;

    updatedJob = {
      jobNumber: 22002,
      client: job.client,
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://domain/`,
      sub: 'test|123456',
      permissions: 'update:jobs',
    });

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a PUT request does not have the required permissions, then a 403 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(22001, getClient._id, '12b acb lane', 'Hamilton'));
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = await job._id;

    updatedJob = {
      jobNumber: 22002,
      client: job.client,
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:jobs',
    });

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a PUT request has an incorrect ":id" parameter, then a 400 response is returned', async () => {
    updatedJob = {
      jobNumber: 22002,
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid id parameter');
    };

    await request(app)
      .put(`/api/job/details/fakeid`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has an ":id" parameter that does not exist, then a 404 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(22001, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 22001 });

    updatedJob = {
      jobNumber: 22002,
      client: job.client,
      address: '12 abc lane',
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job not found');
    };

    await request(app)
      .put(`/api/job/details/507f191e810c19729de860ea`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PUT request has no ":id" parameter, then a 404 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(22001, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 22001 });

    updatedJob = {
      jobNumber: 22002,
      client: job.client,
      address: '12 abc lane',
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Not Found - /api/job/details/');
    };

    await request(app)
      .put(`/api/job/details/`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PUT request has no "jobNumber" field, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(22001, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 22001 });
    const jobParams = job._id;

    updatedJob = {
      client: job.client,
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Missing jobNumber');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request tries to change the "jobNumber" value to a value that already exists, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });

    await JobDetails.create(createNewJob(1, getClient._id, '22 tree lance'));

    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 1,
      client: job.client,
      address: '12 ac lane',
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('JobNumber already exists');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has no "client" property, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 1,
      city: 'Auckland',
      address: '12 abc lane',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Missing Client');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has a "client" property id that does not exist, then a 404 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 1,
      client: '507f191e810c19729de860ea',
      address: '12 abc lane',
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Client does not exist');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has a "client" property that is not a mongoId, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 2,
      client: 'abcdefghijklmnop',
      address: '12 abc lane',
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid client field');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has a "address" property that is not a string, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 2,
      client: getClient._id,
      address: 1,
      city: 'Auckland',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Address must be valid');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has a "city" property that is not a string, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 2,
      client: getClient._id,
      address: '12 abc lane',
      city: false,
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('City must be valid');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has a "area" property that is not a number, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 2,
      client: getClient._id,
      address: '12 abc lane',
      area: '201g',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Area must be a number');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has an "endClient" property that is not a string, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 2,
      client: getClient._id,
      address: '12 abc lane',
      endClient: 3343,
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('End Client must be valid');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has an "isInvoiced" property that is not a Boolean value, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 2,
      client: getClient._id,
      address: '12 abc lane',
      isInvoiced: 'trues',
      color: '#bc32ab',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invoiced must be a boolean value');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has a "color" property that is not a string, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 2,
      client: getClient._id,
      address: '12 abc lane',
      color: true,
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Color must be entered as a Hex value');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has a "color" property that is a string but not a Hex value, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 2,
      client: getClient._id,
      address: '12 abc lane',
      color: 'bc32abfs',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Color must be entered as a Hex value');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has no "color" property, then a 400 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 2,
      client: getClient._id,
      address: '12 abc lane',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Color must be entered as a Hex value');
    };

    await request(app)
      .put(`/api/job/details/${jobParams}`)
      .send(updatedJob)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });

  it('When a DELETE request is valid, authenticated and authorized, then the jobs details are deleted and returned with a 200 response', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job removed');
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: ['delete:jobs'],
    });

    await request(app)
      .delete(`/api/job/details/${jobParams}`)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a DELETE request is made without the required authorization, then a 403 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .delete(`/api/job/details/${jobParams}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a DELETE request is made without a valid token, then a 401 response is returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: 'audience',
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'delete:jobs',
    });

    await request(app)
      .delete(`/api/job/details/${jobParams}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a DELETE request is made with no ":id" parameter, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Not Found - /api/job/details/');
    };

    await request(app)
      .delete(`/api/job/details/`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a DELETE request is made with an incorrectly formatted ":id" parameter, then a 400 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid id parameter');
    };

    await request(app)
      .delete(`/api/job/details/badjobid`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a DELETE request is made with an ":id" parameter that does not exist, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Job not found');
    };

    await request(app)
      .delete(`/api/job/details/507f191e810c19729de860ea`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
});

/**
 * @endpoint - /api/job/parts
 * @paths - GET, POST
 */

describe('Given we have an "/api/job/parts" endpoint', () => {
  it('when a GET request is valid, authenticated and authrorized, then it should return a list of job parts', async () => {
    for (let i = 0; i < 20; i++) {
      await JobPart.create({ jobPartTitle: `Schedule${i}`, jobOrder: i });
    }
    const checkBody = (res) => {
      expect(res.body.jobParts.length).toBe(20);
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:job_parts',
    });

    await request(app)
      .get('/api/job/parts/')
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request has an invalid token, then a 401 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: 'audience',
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:job_parts',
    });

    await request(app)
      .get('/api/job/parts/')
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a GET request does not have the required authorization, then a 403 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'create:jobs',
    });

    await request(app)
      .get('/api/job/parts/')
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('when a POST request is valid and authorized, then the job part should be created and returned', async () => {
    const jobPart = {
      jobPartTitle: 'Box-up',
      jobDescription: 'Sturcturally secure the floor footing',
    };

    const checkBody = (res) => {
      expect(res.body).toEqual(expect.objectContaining(jobPart));
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'create:job_parts',
    });

    await request(app)
      .post('/api/job/parts/')
      .send(jobPart)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(201);
  });
  it('When a POST request has an invalid token, then a 401 response is returned', async () => {
    const jobPart = {
      jobPartTitle: 'Box-up',
      jobDescription: 'Sturcturally secure the floor footing',
    };

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://domain/`,
      sub: 'test|123456',
      permissions: 'create:job_parts',
    });

    await request(app)
      .post('/api/job/parts/')
      .send(jobPart)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a POST request has insufficient permissions, then a 403 response is returned', async () => {
    const jobPart = {
      jobPartTitle: 'Box-up',
      jobDescription: 'Sturcturally secure the floor footing',
    };

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:job_parts',
    });

    await request(app)
      .post('/api/job/parts/')
      .send(jobPart)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a POST request is made and the "jobPartTitle" is not entered in the correct format, then a 400 response is returned', async () => {
    const jobPart = {
      jobPartTitle: { job: 'Box-up' },
      jobDescription: 'Sturcturally secure the floor footing',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Job Part must be valid');
    };

    await request(app)
      .post('/api/job/parts/')
      .send(jobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request is made and the "jobPartTitle" already exists, then a 400 response is returned', async () => {
    const jobPart = {
      jobPartTitle: 'Box-up',
      jobDescription: 'Sturcturally secure the floor footing',
    };

    await JobPart.create({ ...jobPart, jobOrder: 5 });

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job Part already exists!');
    };

    await request(app)
      .post('/api/job/parts/')
      .send(jobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request is made and the "jobOrder" is not entered as a number, then return a 400 response', async () => {
    const jobPart = {
      jobPartTitle: 'Box-up',
      jobOrder: 'foo',
      jobDescription: 'Sturcturally secure the floor footing',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Job part order must be a number');
    };

    await request(app)
      .post('/api/job/parts/')
      .send(jobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request is made and the "jobDescription" is entered incorrectly, then a 400 response should be returned', async () => {
    const jobPart = {
      jobPartTitle: 'Box-up',
      jobDescription: { jobs: 'foo' },
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Job Description must be valid');
    };

    await request(app)
      .post('/api/job/parts/')
      .send(jobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
});

/**
 * @endpoint - /api/job/parts/:id
 * @paths - GET, PUT, DELETE
 */

describe('Given we have an "/api/job/parts/:id" endpoint', () => {
  beforeEach(async () => {
    await JobPart.create({ jobPartTitle: 'Make food', jobOrder: 0 });
  });
  afterEach(async () => {
    await JobPart.deleteMany();
  });
  it('When a GET request is valid and authorized, then it should respond with a 200 code and the job part', async () => {
    const savedJobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    const checkBody = (res) => {
      expect(res.body.jobPartTitle).toBe('Make food');
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:job_parts',
    });

    await request(app)
      .get(`/api/job/parts/${savedJobPart._id}`)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request is not appropriately authroized, then it should respond with a 403 response', async () => {
    const savedJobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .get(`/api/job/parts/${savedJobPart._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a GET request does not have a valid token, then it should respond with a 401 response', async () => {
    const savedJobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://domain/`,
      sub: 'test|123456',
    });

    await request(app)
      .get(`/api/job/parts/${savedJobPart._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a GET request with a jobPart that does not exist, then it should respond with a 404 code and an error', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Job part not found');
    };

    await request(app)
      .get(`/api/job/parts/507f191e810c19729de860ea`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a GET request with an incorrect :id parameter, then it should respond with a 400 error code', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid id parameter');
    };

    await request(app)
      .get(`/api/job/parts/invalidparameter`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request is valid and authorized, then a 200 response is returned and the jobPart is updated', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    updatedJobPart = {
      jobPartTitle: 'call owners',
    };

    const checkBody = (res) => {
      expect(res.body.jobPartTitle).toBe(updatedJobPart.jobPartTitle);
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'update:job_parts',
    });

    await request(app)
      .put(`/api/job/parts/${jobPart._id}`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a PUT request has an invalid token, then a 401 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    updatedJobPart = {
      jobPartTitle: 'call owners',
    };

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://domain/`,
      sub: 'test|123456',
      permissions: 'update:job_parts',
    });

    await request(app)
      .put(`/api/job/parts/${jobPart._id}`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a PUT request does not have a token then a 401 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    updatedJobPart = {
      jobPartTitle: 'call owners',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('No authorization token was found');
    };

    await request(app)
      .put(`/api/job/parts/${jobPart._id}`)
      .send(updatedJobPart)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a PUT request is not appropriately authorized, the a 403 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    updatedJobPart = {
      jobPartTitle: 'call owners',
    };

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .put(`/api/job/parts/${jobPart._id}`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a PUT request has a "jobPartTitle" in an incorrect format, then a 400 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    updatedJobPart = {
      jobPartTitle: { test: 'test' },
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Job Part must be valid');
    };

    await request(app)
      .put(`/api/job/parts/${jobPart._id}`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has no "jobPartTitle" property, then a 400 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    updatedJobPart = {
      jobOrder: 2,
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Missing Job Part Title');
    };

    await request(app)
      .put(`/api/job/parts/${jobPart._id}`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has no "jobOrder" property, then the jobOrder does not change and a 200 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    updatedJobPart = {
      jobPartTitle: 'work',
      jobDescription: 'do lots',
    };

    const checkBody = (res) => {
      expect(res.body.jobOrder).toEqual(expect.any(Number));
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
  it('When a PUT request has "jobOrder" property that is entered in an incorrect format, then a 400 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    updatedJobPart = {
      jobPartTitle: 'make boxes',
      jobOrder: 'make boxes',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Job part order must be a number');
    };

    await request(app)
      .put(`/api/job/parts/${jobPart._id}`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has "jobDescription" property that is entered in an incorrect format, then a 400 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    updatedJobPart = {
      jobPartTitle: 'make boxes',
      jobDescription: { job: 'description' },
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Job Description must be valid');
    };

    await request(app)
      .put(`/api/job/parts/${jobPart._id}`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has an invalid ":id" parameter, then a 400 response is returned', async () => {
    updatedJobPart = {
      jobPartTitle: 'make boxes',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid id parameter');
    };

    await request(app)
      .put(`/api/job/parts/invalidjobpartid`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has an ":id" parameter that does not exist, then a 404 response is returned', async () => {
    updatedJobPart = {
      jobPartTitle: 'make boxes',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job part not found');
    };

    await request(app)
      .put(`/api/job/parts/507f191e810c19729de860ea`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PUT request has an empty ":id" parameter, then a 404 response is returned', async () => {
    updatedJobPart = {
      jobPartTitle: 'make boxes',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Not Found - /api/job/parts');
    };

    await request(app)
      .put(`/api/job/parts`)
      .send(updatedJobPart)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });

  it('When a valid DELETE request is made then the jobs part is deleted and returned with a 200 response', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job part removed');
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'delete:job_parts',
    });

    await request(app)
      .delete(`/api/job/parts/${jobPart._id}`)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a DELETE request has an invalid token, then a 401 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: 'audience',
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'delete:job_parts',
    });

    await request(app)
      .delete(`/api/job/parts/${jobPart._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a DELETE request does not have a token then a 401 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    const checkBody = (res) => {
      expect(res.body.message).toBe('No authorization token was found');
    };

    await request(app)
      .delete(`/api/job/parts/${jobPart._id}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a DELETE request is not appropriately authorized, the a 403 response is returned', async () => {
    const jobPart = await JobPart.findOne({ jobPartTitle: 'Make food' });

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .delete(`/api/job/parts/${jobPart._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a DELETE request has an invalid ":id" parameter, then a 400 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid id parameter');
    };

    await request(app)
      .delete(`/api/job/parts/invalididparam`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a DELETE request has an ":id" parameter that does not exist, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Job part not found');
    };

    await request(app)
      .delete(`/api/job/parts/507f191e810c19729de860ea`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a DELETE request has an empty ":id" parameter, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Not Found - /api/job/parts/');
    };

    await request(app)
      .delete(`/api/job/parts/`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
});

/**
 * @endpoint - /api/job/duedates/parts
 * @paths - GET
 */

describe('Given we have a "/api/job/duedates" endpoint', () => {
  beforeEach(async () => {
    const clientId = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(1, clientId._id));
    await JobPart.create({ jobPartTitle: 'strip walls', jobOrder: 0 });
    await JobPart.create({ jobPartTitle: 'box walls', jobOrder: 1 });
  });

  afterEach(async () => {
    await JobDetails.deleteMany();
    await JobPart.deleteMany();
    await JobDueDate.deleteMany();
  });
  it('When a GET request is valid and authorized, then a 200 respose with all due dates is recieved', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.find();

    for (jobPart of databaseJobPart) {
      await JobDueDate.create({
        job: databaseJob._id,
        jobPartTitle: jobPart._id,
        dueDate: '2021-02-22',
        startDate: '2021-02-21',
        dueDateRange: ['2021-02-22T00:00:00.000+00:00', '2021-02-21T00:00:00.000+00:00'],
      });
    }

    const checkBody = (res) => {
      expect(res.body.length).toBe(2);
      expect(res.body[0].jobPartTitle.jobPartTitle).toBe('strip walls');
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:due_dates',
    });

    await request(app)
      .get('/api/job/duedates/parts?rangeStart=2021-02-20&rangeEnd=2021-02-23')
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request has an invalid token, then a 401 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://domain}/`,
      sub: 'test|123456',
      permissions: 'read:due_dates',
    });

    await request(app)
      .get('/api/job/duedates/parts')
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a GET request has a token with insufficient permissions, then a 403 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .get('/api/job/duedates/parts')
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a GET request is made with date range queries, then only the due dates that are in the range are returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const firstJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });
    const secondJobPart = await JobPart.findOne({ jobPartTitle: 'box walls' });

    await JobDueDate.create({
      job: databaseJob._id,
      jobPartTitle: firstJobPart._id,
      dueDate: '2021-02-22',
      dueDateRange: ['2021-02-22T00:00:00.000+00:00'],
    });

    await JobDueDate.create({
      job: databaseJob._id,
      jobPartTitle: secondJobPart._id,
      dueDate: '2021-05-20',
      dueDateRange: ['2021-05-20T00:00:00.000+00:00'],
    });

    const checkBody = (res) => {
      expect(res.body.length).toBe(1);
      expect(res.body[0].jobPartTitle.jobPartTitle).toBe('strip walls');
    };

    await request(app)
      .get('/api/job/duedates/parts?rangeStart=2021-02-20&rangeEnd=2021-03-20')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request is made with invalid query parameters, then a 400 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid query parameters');
    };

    await request(app)
      .get('/api/job/duedates/parts?rangeStart=water&rangeEnd=fire')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
});

/**
 * @endpoint - /api/job/duedates/parts/:jobid
 * @paths - GET, POST, PATCH, DELETE
 */

describe('Given we have a "/api/job/duedates/parts/:jobid" endpoint', () => {
  beforeEach(async () => {
    const clientId = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(1, clientId._id));
    await JobPart.create({ jobPartTitle: 'strip walls', jobOrder: 0 });
  });

  afterEach(async () => {
    await JobDetails.deleteMany();
    await JobPart.deleteMany();
    await JobDueDate.deleteMany();
  });
  it("When a GET request is valid and has the required permissions, then a 200 response with the given job's due dates is recieved", async () => {
    // Create a new job part so there are two job parts
    await JobPart.create({ jobPartTitle: 'break walls', jobOrder: 1 });

    const databaseClient = await Client.findOne({ clientName: 'warehouse' });
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });

    const databaseJobParts = await JobPart.find();

    // Create a new job to make sure only the required job due dates are returned
    await JobDetails.create(createNewJob(2, databaseClient._id, '22 lane way'));
    const databaseDifferentJob = await JobDetails.findOne({ jobNumber: 2 });

    // Create a due date for each job part (2) and for each job (2). This would create 4 entries in total
    for (const jobPart of databaseJobParts) {
      await JobDueDate.create({
        job: databaseJob._id,
        jobPartTitle: jobPart._id,
        dueDate: '2021-12-10',
        dueDateRange: '2021-12-10T00:00:00.000+00:00',
      });

      const differentJob = {
        job: databaseDifferentJob._id,
        jobPartTitle: jobPart._id,
        dueDate: '2021-12-10',
        dueDateRange: '2021-12-10T00:00:00.000+00:00',
      };

      await JobDueDate.create(differentJob);
    }

    // Should return only 2 results and should be for the desired job
    const checkBody = (res) => {
      expect(res.body.length).toBe(2);
      expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ job: String(databaseJob._id) })]));
      expect(res.body).not.toEqual(expect.arrayContaining([expect.objectContaining({ job: String(databaseDifferentJob._id) })]));
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:due_dates',
    });

    await request(app)
      .get(`/api/job/duedates/parts/${databaseJob._id}`)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request has an invalid token, then a 401 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain/`,
      sub: 'test|123456',
      permissions: 'read:due_dates',
    });

    await request(app)
      .get(`/api/job/duedates/parts/${databaseJob._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a GET request has insufficient permissions, then a 403 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .get(`/api/job/duedates/parts/${databaseJob._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a GET request has an invalid ":jobid" parameter, then a 400 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid jobid parameter');
    };

    await request(app)
      .get(`/api/job/duedates/parts/invalidjobid`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a GET request has a ":jobid" parameter that does not exist, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Job not found');
    };

    await request(app)
      .get(`/api/job/duedates/parts/507f191e810c19729de860ea`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a POST request is valid and authorized, then the due date is created and a 201 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const newContractor = { contractor: 'maxs', name: 'max', email: 'max@gmail.com' };
    await Contractor.create(newContractor);
    const databaseContractor = await Contractor.findOne({ contractor: 'maxs' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
      contractors: [databaseContractor._id],
    };

    const checkBody = (res) => {
      expect(res.body.job).toBe(String(databaseJob._id));
      expect(res.body.jobPartTitle).toBe(String(databaseJobPart._id));
      expect(res.body.dueDate).toBe('2021-12-10');
      expect(res.body.contractors[0]).toBe(String(databaseContractor._id));
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'create:due_dates',
    });

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(201);
  });
  it('When a POST request has an invalid token, then a 401 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: 'test|123456',
      permissions: 'create:due_dates',
    });

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a POST request has insufficient permissions, then a 403 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a POST request has an invalid ":jobid" parameter, then a 400 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it.skip('When a POST request has a ":jobid" parameter that does not exist, then a 404 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Job does not exist');
    };

    await request(app)
      .post(`/api/job/duedates/parts/507f191e810c19729de860ea?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a POST request has no ":jobid" parameter, then a 404 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe(`Not Found - /api/job/duedates/parts/?partid=${databaseJobPart._id}`);
    };

    await request(app)
      .post(`/api/job/duedates/parts/?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a POST request has an ":jobid" parameter that is not in the correct format, then a 400 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe(`Invalid jobid parameter`);
    };

    await request(app)
      .post(`/api/job/duedates/parts/invalidjobid?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request has a "partid" query property that does not exist, then a 404 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe(`Job part does not exist`);
    };

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=507f191e810c19729de860ea`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a POST request has no "partid" query property property then a 400 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe(`Job Part must be valid`);
    };

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request has an invalid "partid" query property, then a 400 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe(`Job Part must be valid`);
    };

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=invalidJobpartid`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request has an invalid "dueDate" property, then a 400 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '20211210',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe(`Due date must be valid (yyyy-MM-dd)`);
    };

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request has an invalid "startDate" property, then a 400 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const startDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      startDate: '20211210',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe(`Start date must be valid (yyyy-MM-dd)`);
    };

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=${databaseJobPart._id}`)
      .send(startDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request has an invalid "contractor" properties, then a 400 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
      contractors: [{ contact: 222, email: 'abceemail', phone: false }],
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe(`contractors field must be valid`);
    };

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request has already been created, then a 400 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    const dueDate = {
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-10',
    };

    await JobDueDate.create(dueDate);

    const checkBody = (res) => {
      expect(res.body.message).toBe(`Due date already exists`);
    };

    await request(app)
      .post(`/api/job/duedates/parts/${databaseJob._id}?partid=${databaseJobPart._id}`)
      .send(dueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });

  it('When a PATCH request is valid and authorized, then all job due dates are altered and a 200 response is returned', async () => {
    await JobPart.create({ jobPartTitle: 'box walls', jobOrder: 1 });

    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobParts = await JobPart.find();

    for (const jobPart of databaseJobParts) {
      await JobDueDate.create({
        job: databaseJob._id,
        jobPartTitle: jobPart._id,
        dueDate: '2021-12-10',
      });
    }

    const updateDueDate = {
      scheduleShift: 5,
    };

    const checkBody = async (res) => {
      const updatedDueDate = await JobDueDate.find({ job: databaseJob._id });
      expect(res.body.message).toBe(`Due Dates shifted by 5 day(s)`);
      expect(updatedDueDate[0].dueDate).toBe('2021-12-15');
      expect(updatedDueDate[1].dueDate).toBe('2021-12-15');
    };

    await request(app)
      .patch(`/api/job/duedates/parts/${databaseJob._id}`)
      .send(updateDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a PATCH request has a negative "scheduleShift" property, then all job due dates are altered appropriately and a 200 response is returned', async () => {
    await JobPart.create({ jobPartTitle: 'box walls', jobOrder: 1 });

    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobParts = await JobPart.find();

    for (const jobPart of databaseJobParts) {
      await JobDueDate.create({
        job: databaseJob._id,
        jobPartTitle: jobPart._id,
        dueDate: '2021-12-10',
      });
    }

    const updateDueDate = {
      scheduleShift: -3,
    };

    const checkBody = async (res) => {
      const updatedDueDate = await JobDueDate.find({ job: databaseJob._id });
      expect(res.body.message).toBe(`Due Dates shifted by -3 day(s)`);
      expect(updatedDueDate[0].dueDate).toBe('2021-12-07');
      expect(updatedDueDate[1].dueDate).toBe('2021-12-07');
    };

    await request(app)
      .patch(`/api/job/duedates/parts/${databaseJob._id}`)
      .send(updateDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a PATCH request has an invalid token, then a 401 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });

    const updateDueDate = {
      scheduleShift: 5,
    };

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: 'test|123456',
      permissions: 'update:due_dates',
    });

    await request(app)
      .patch(`/api/job/duedates/parts/${databaseJob._id}`)
      .send(updateDueDate)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a PATCH request has insufficient permissions, then a 403 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });

    const updateDueDate = {
      scheduleShift: 5,
    };

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .patch(`/api/job/duedates/parts/${databaseJob._id}`)
      .send(updateDueDate)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a PATCH request has an invalid ":jobid" parameter, then a 400 response is returned', async () => {
    const updateDueDate = {
      scheduleShift: 5,
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid jobid parameter');
    };

    await request(app)
      .patch(`/api/job/duedates/parts/invalidJobidparam`)
      .send(updateDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PATCH request has a ":jobid" parameter that does not exist, then a 404 response is returned', async () => {
    const updateDueDate = {
      scheduleShift: 5,
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Due date not found');
    };

    await request(app)
      .patch(`/api/job/duedates/parts/507f191e810c19729de860ea`)
      .send(updateDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PATCH request has no ":jobid" parameter, then a 404 response is returned', async () => {
    const updateDueDate = {
      scheduleShift: 5,
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Not Found - /api/job/duedates/parts/');
    };

    await request(app)
      .patch(`/api/job/duedates/parts/`)
      .send(updateDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PATCH request has a "scheduleShift" property that is not an integer, then a 400 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });

    const updateDueDate = {
      scheduleShift: 'five',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Shift must be valid');
    };

    await request(app)
      .patch(`/api/job/duedates/parts/${databaseJob._id}`)
      .send(updateDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });

  it('When a DELETE request is valid and has the required permissions, then is should return a 200 response with a success message', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    await JobDueDate.create({
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-12-12',
    });

    const checkBody = (res) => {
      expect(res.body.message).toBe('deleted!');
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'delete:due_dates',
    });

    await request(app)
      .delete(`/api/job/duedates/parts/${databaseJob._id}`)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a DELETE request has an invalid token, then a 401 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: 'test|123456',
      permissions: 'delete:due_dates',
    });

    await request(app)
      .delete(`/api/job/duedates/parts/${databaseJob._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a DELETE request has insufficient permissions, then a 403 response is returned', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'read:due_dates',
    });

    await request(app)
      .delete(`/api/job/duedates/parts/${databaseJob._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a DELETE request has an invalid ":jobid" parameter, then a 400 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid jobid parameter');
    };

    await request(app)
      .delete(`/api/job/duedates/parts/{databaseJob._id}`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a DELETE request has a ":jobid" parameter that does not exist, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe("Due dates don't exist for this job");
    };

    await request(app)
      .delete(`/api/job/duedates/parts/507f191e810c19729de860ea`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
});

/**
 * @endpoint - /api/job/duedates/job/part/:id
 * @paths - PUT, PATCH, DELETE
 */

describe('Given we have a "/api/job/duedates/job/part/:id" endpoint', () => {
  beforeEach(async () => {
    const clientId = await Client.findOne({ clientName: 'warehouse' });
    await JobDetails.create(createNewJob(1, clientId._id));
    await JobPart.create({ jobPartTitle: 'strip walls', jobOrder: 0 });

    const databaseJob = await JobDetails.findOne({ jobNumber: 1 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'strip walls' });

    await JobDueDate.create({
      job: databaseJob._id,
      jobPartTitle: databaseJobPart._id,
      dueDate: '2021-10-12',
      contractor: { contact: 'builder r us', email: 'abc@gmail.com', phone: '02111111' },
    });
  });

  afterEach(async () => {
    await JobDetails.deleteMany();
    await JobPart.deleteMany();
    await JobDueDate.deleteMany();
  });
  it('When a PUT request is valid and appropriately authorized, then is should update the job part due date and return a 200 response with the updated due date.', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const updatedDueDate = {
      dueDate: '2021-12-12',
      contractors: ['507f191e810c19729de860ea'],
    };

    const checkBody = (res) => {
      expect(res.body).toEqual(expect.objectContaining(updatedDueDate));
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'update:due_dates',
    });

    await request(app)
      .put(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a PUT request has an invalid token, then a 401 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const updatedDueDate = {
      dueDate: '2021-12-12',
      contractor: { contact: 'flooring R us', email: 'abc@gmail.com' },
    };

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: 'test|123456',
      permissions: 'update:due_dates',
    });

    await request(app)
      .put(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a PUT request has insufficient permissions, then a 403 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const updatedDueDate = {
      dueDate: '2021-12-12',
      contractor: { contact: 'flooring R us', email: 'abc@gmail.com' },
    };

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .put(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a PUT request has an invalid ":id" parameter, then a 400 response is returned', async () => {
    const updatedDueDate = {
      dueDate: '2021-12-12',
      contractor: { contact: 'flooring R us', email: 'abc@gmail.com' },
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid id parameter');
    };

    await request(app)
      .put(`/api/job/duedates/job/part/invalidIdparam`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has a ":id" parameter that does not exist, then a 404 response is returned', async () => {
    const updatedDueDate = {
      dueDate: '2021-12-12',
      contractor: { contact: 'flooring R us', email: 'abc@gmail.com' },
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Due date not found');
    };

    await request(app)
      .put(`/api/job/duedates/job/part/507f191e810c19729de860ea`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PUT request has no ":id" parameter, then a 404 response is returned', async () => {
    const updatedDueDate = {
      dueDate: '2021-12-12',
      contractor: { contact: 'flooring R us', email: 'abc@gmail.com' },
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Not Found - /api/job/duedates/job/part/');
    };

    await request(app)
      .put(`/api/job/duedates/job/part/`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PUT request has an invalid "dueDate" property, then a 400 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const updatedDueDate = {
      dueDate: '12/10/2021',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Due date must be valid (yyyy-MM-dd)');
    };

    await request(app)
      .put(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request has an invalid "contractor" property, then a 400 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const updatedDueDate = {
      dueDate: '2021-10-10',
      contractors: { contact: 332321, email: 'abcgmail.com' },
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('contractors field must be valid');
    };

    await request(app)
      .put(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });

  it('When a PATCH request is valid and authorized, then the duedate is updated and a 200 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const updatedDueDate = {
      dueDate: '2021-12-12',
    };

    const checkBody = async (res) => {
      expect(res.body.message).toBe('due date updated');
      const dbUpdatedDueDate = await JobDueDate.findById(dueDateParams._id);
      expect(dbUpdatedDueDate).toEqual(expect.objectContaining(updatedDueDate));
      expect(dbUpdatedDueDate.contractors).toBeTruthy();
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'update:due_dates',
    });

    await request(app)
      .patch(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a PATCH request has an invalid token, then a 401 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const updatedDueDate = {
      dueDate: '2021-12-12',
    };

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: 'test|123456',
      permissions: 'update:due_dates',
    });

    await request(app)
      .patch(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a PATCH request has insufficient permissions, then a 403 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const updatedDueDate = {
      dueDate: '2021-12-12',
    };

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .patch(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a PATCH request has an invalid ":id" parameter, then a 400 response is returned', async () => {
    const updatedDueDate = {
      dueDate: '2021-12-12',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid id parameter');
    };

    await request(app)
      .patch(`/api/job/duedates/job/part/invalidIdParam`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PATCH request has a ":id" parameter that does not exist, then a 404 response is returned', async () => {
    const updatedDueDate = {
      dueDate: '2021-12-12',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Due date not found');
    };

    await request(app)
      .patch(`/api/job/duedates/job/part/507f191e810c19729de860ea`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PATCH request has no ":id" parameter, then a 404 response is returned', async () => {
    const updatedDueDate = {
      dueDate: '2021-12-12',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Not Found - /api/job/duedates/job/part/');
    };

    await request(app)
      .patch(`/api/job/duedates/job/part/`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PATCH request has an invalid "dueDate" property, then a 400 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const updatedDueDate = {
      dueDate: '2021/12/12',
    };

    const checkBody = async (res) => {
      expect(res.body.errors[0].msg).toBe('Due date must be valid (yyyy-MM-dd)');
    };

    await request(app)
      .patch(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a DELETE request is valid and authorized, then is should return a 200 response with a success message.', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const checkBody = async (res) => {
      expect(res.body.message).toBe('Deleted!');
      const dueDate = await JobDueDate.findById(dueDateParams._id);
      expect(dueDate).toBe(null);
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
      permissions: 'delete:due_dates',
    });

    await request(app)
      .delete(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a DELETE request has an invalid token, then a 401 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: 'test|123456',
      permissions: 'delete:due_dates',
    });

    await request(app)
      .delete(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a DELETE request has insufficient permissions, then a 403 response is returned', async () => {
    const dueDateParams = await JobDueDate.findOne({ dueDate: '2021-10-12' });

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: 'test|123456',
    });

    await request(app)
      .delete(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a DELETE request has an invalid ":id" parameter, then a 400 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid id parameter');
    };

    await request(app)
      .delete(`/api/job/duedates/job/part/invalididparam`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a DELETE request has a ":id" parameter that does not exist, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Due date not found');
    };

    await request(app)
      .delete(`/api/job/duedates/job/part/507f191e810c19729de860ea`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a DELETE request has no ":id" parameter, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Not Found - /api/job/duedates/job/part/');
    };

    await request(app)
      .delete(`/api/job/duedates/job/part/`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
});

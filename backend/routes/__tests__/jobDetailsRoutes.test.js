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

afterAll(async () => {
  await mongoose.disconnect();
  jwks.stop();
});

const jwks = createJWKSMock(`https://${domain}/`);
const token = jwks.token({
  aud: audience,
  iss: `https://${domain}/`,
  sub: 'test|123456',
  permissions: ['read:jobs', 'create:jobs', 'update:jobs', 'delete:jobs'],
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
  it('When a GET request is valid, authenticated and appropriately authrorized, then a 200 response with a list of jobs should be returned', async () => {
    const getClient = await Client.findOne({ clientName: 'warehouse' });
    for (let jobId = 22000; jobId < 22020; jobId++) {
      const newJob = createNewJob(jobId, getClient._id);
      await JobDetails.create(newJob);
    }

    const checkBody = (res) => {
      expect(res.body.length).toBe(20);
      expect(res.body[0].client.clientName).toBe('warehouse');
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
  it('When a GET request is made without a valid token, then the user should recieve an error 401 response', async () => {
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
  it('When a GET request is made without the required permissions, then the user should recieve an error 403 response', async () => {
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
      expect(res.body).toEqual([]);
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

    await JobDetails.create(createNewJob(1, getClient._id));

    await JobDetails.create(createNewJob(2, getClient._id));
    const job = await JobDetails.findOne({ jobNumber: 2 });
    const jobParams = job._id;

    updatedJob = {
      jobNumber: 1,
      client: job.client,
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
      endClient: null,
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

/**
 * @endpoint - /api/job/parts/:id
 * @paths - GET, PUT, DELETE
 */

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

/**
 * @endpoint - /api/job/duedates/parts
 * @paths - GET
 */

describe('Given we have a "/api/job/duedates" endpoint', () => {
  beforeEach(async () => {
    await Client.create({ clientName: 'Coca-cola' });
    const clientId = await Client.findOne({ clientName: 'Coca-cola' });
    await JobDetails.create(createNewJob(23000, clientId._id));
    await JobPart.create({ jobPartTitle: 'strip walls' });
  });

  afterEach(async () => {
    await Client.deleteMany();
    await JobDetails.deleteMany();
    await JobPart.deleteMany();
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
      .get('/api/job/duedates/parts')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
});

/**
 * @endpoint - /api/job/duedates/parts/:jobid
 * @paths - GET, POST, DELETE
 */

describe('Given we have a "/api/job/duedates/parts/:jobid" endpoint', () => {
  beforeAll(async () => {
    await Client.create({ clientName: 'Cherry' });
    const clientId = await Client.findOne({ clientName: 'Cherry' });
    await JobDetails.create(createNewJob(23002, clientId._id));
    await JobPart.create({ jobPartTitle: 'box-up' });
  });
  it("When a valid and authenticated GET request is made, then a 200 response with the given job's due dates is recieved", async () => {
    const databaseClient = await Client.findOne({ clientName: 'Cherry' });
    const databaseJob = await JobDetails.findOne({ jobNumber: 23002 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'box-up' });

    await JobDueDate.create({
      job: databaseJob._id,
      jobDescription: databaseJobPart._id,
      dueDate: '10/12/2021',
    });

    await JobDetails.create(createNewJob(23003, databaseClient._id));
    const databaseDifferentJob = await JobDetails.findOne({ jobNumber: 23003 });

    const differentJob = {
      job: databaseDifferentJob._id,
      jobDescription: databaseJobPart._id,
      dueDate: '12/12/2022',
    };

    await JobDueDate.create(differentJob);

    const checkBody = (res) => {
      expect(res.body.length).toBe(1);
      expect(res.body[0]).not.toEqual(expect.objectContaining(differentJob));
    };

    await request(app)
      .get(`/api/job/duedates/parts/${databaseJob._id}`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a valid authenticated DELETE request is made, then is should return a 200 response with a success message', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 23002 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'box-up' });

    await JobDueDate.create({
      job: databaseJob._id,
      jobDescription: databaseJobPart._id,
      dueDate: '10/12/2021',
    });

    const checkBody = (res) => {
      expect(res.body.message).toBe('deleted!');
    };

    await request(app)
      .delete(`/api/job/duedates/parts/${databaseJob._id}`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
});

/**
 * @endpoint - /api/job/duedates/job/part/:id
 * @paths - PUT, DELETE
 */

describe('Given we have a "/api/job/duedates/job/:jobid/part/:partid" endpoint', () => {
  beforeAll(async () => {
    await Client.create({ clientName: 'Liquidify' });
    const clientId = await Client.findOne({ clientName: 'Liquidify' });
    await JobDetails.create(createNewJob(23004, clientId._id));
    await JobPart.create({ jobPartTitle: 'lay-concrete' });
  });
  it('When a valid authenticated PUT request is made then is should update the job part due date and return a 200 response with the updated due date.', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 23004 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'lay-concrete' });

    await JobDueDate.create({
      job: databaseJob._id,
      jobDescription: databaseJobPart._id,
      dueDate: '10/12/2021',
      contractor: 'Builders R us',
    });

    const dueDateParams = await JobDueDate.findOne({ job: databaseJob._id, jobDescription: databaseJobPart._id });

    const updatedDueDate = {
      dueDate: '5/12/2021',
    };

    const checkBody = (res) => {
      expect(res.body).toEqual(expect.objectContaining(updatedDueDate));
      expect(res.body.contractor).toBe('Builders R us');
    };

    await request(app)
      .put(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .send(updatedDueDate)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a valid authenticated DELETE request is made then is should return a 200 response with a success message.', async () => {
    const databaseJob = await JobDetails.findOne({ jobNumber: 23004 });
    const databaseJobPart = await JobPart.findOne({ jobPartTitle: 'lay-concrete' });

    await JobDueDate.create({
      job: databaseJob._id,
      jobDescription: databaseJobPart._id,
      dueDate: '20/12/2020',
      contractor: 'Builders',
    });

    const dueDateParams = await JobDueDate.findOne({ job: databaseJob._id, jobDescription: databaseJobPart._id });

    const checkBody = (res) => {
      expect(res.body.message).toBe('Deleted!');
    };

    await request(app)
      .delete(`/api/job/duedates/job/part/${dueDateParams._id}`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
});

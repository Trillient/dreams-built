const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: createJWKSMock } = require('mock-jwks');

const app = require('../../app');
const database = require('../../config/database');
const { domain, audience } = require('../../config/env');
const Contractor = require('../../models/contractorModel');
const JobDueDate = require('../../models/jobPartDueDateModel');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
  jwks.start();
});

afterEach(async () => {
  await Contractor.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  jwks.stop();
});

const jwks = createJWKSMock(`https://${domain}/`);
const clientId = 'test|123456';
const token = jwks.token({
  aud: audience,
  iss: `https://${domain}/`,
  sub: clientId,
  permissions: ['read:contractors', 'create:contractors', 'update:contractors', 'delete:contractors'],
});

const createNewContractor = (contractor, contact, email, phone) => {
  return {
    contractor: contractor,
    contact: contact,
    email: email,
    phone: phone,
  };
};

describe('Given we have an "/api/contractors" endpoint', () => {
  it('When a GET request is made and is valid, authenticated and appropriately authorized, then a 200 response with a list of contractors should be returned', async () => {
    for (let i = 0; i < 20; i++) {
      await Contractor.create(createNewContractor(`contractor${i}`));
    }

    const checkBody = (res) => {
      expect(res.body.error).toBeUndefined();
      expect(res.body.contractorList.length).toBe(20);
      expect(res.body.pages).toBe(1);
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
      permissions: 'read:contractors',
    });

    await request(app)
      .get('/api/contractors/')
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request is made and is valid, authenticated and appropriately authorized with pagination queries, then a 200 response with a list of contractors should be returned', async () => {
    for (let i = 0; i < 20; i++) {
      await Contractor.create(createNewContractor(`contractor${i}`));
    }

    const checkBody = (res) => {
      expect(res.body.error).toBeUndefined();
      expect(res.body.contractorList.length).toBe(5);
      expect(res.body.contractorList[0].contractor).toBe('contractor14');
      expect(res.body.pages).toBe(3);
    };

    await request(app)
      .get('/api/contractors?limit=5&page=2&keyword=1')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request has an invalid token, then a 401 response is returned', async () => {
    for (let i = 0; i < 1; i++) {
      await Contractor.create(createNewContractor(`contractor${i}`));
    }

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: clientId,
      permissions: 'read:contractors',
    });

    await request(app)
      .get('/api/contractors/')
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a GET request has insufficient permissions, then a 403 response is returned', async () => {
    for (let i = 0; i < 1; i++) {
      await Contractor.create(createNewContractor(`contractor${i}`));
    }

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
    });

    await request(app)
      .get('/api/contractors/')
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a POST request is made and is valid, authenticated and appropriately authorized, then a 201 response should be returned', async () => {
    const contractor = createNewContractor('foomill', 'foo', 'foo@gmail.com', '555931888');

    const checkBody = (res) => {
      expect(res.body.message).toBe('success');
      expect(res.body.contractor).toEqual(expect.objectContaining(contractor));
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
      permissions: 'create:contractors',
    });

    await request(app)
      .post('/api/contractors/')
      .send(contractor)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(201);
  });
  it('When a POST request is made and has an invalid token, then a 401 response should be returned', async () => {
    const contractor = createNewContractor('foomill', 'foo', 'foo@gmail.com', '555931888');

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: clientId,
      permissions: 'create:contractors',
    });

    await request(app)
      .post('/api/contractors/')
      .send(contractor)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a POST request is made and has insufficient permissions, then a 403 response should be returned', async () => {
    const contractor = createNewContractor('foomill', 'foo', 'foo@gmail.com', '555931888');

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
    });

    await request(app)
      .post('/api/contractors/')
      .send(contractor)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a POST request is made and the contractor already exists, then a 409 response should be returned', async () => {
    const contractor = createNewContractor('foomill', 'foo', 'foo@gmail.com', '555931888');

    await Contractor.create(contractor);

    const checkBody = (res) => {
      expect(res.body.message).toBe('Contractor already exists');
    };

    await request(app)
      .post('/api/contractors/')
      .send(contractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(409);
  });
  it('When a POST request is made and the "contractor" property is invalid, then a 400 response should be returned', async () => {
    const contractor = createNewContractor(12345, 'foo', 'foo@gmail.com', '555931888');

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Contractor Invalid');
    };

    await request(app)
      .post('/api/contractors/')
      .send(contractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request is made and the "contractor" property is missing, then a 400 response should be returned', async () => {
    const contractor = createNewContractor(null, 'foo', 'foo@gmail.com', '555931888');

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Contractor Invalid');
    };

    await request(app)
      .post('/api/contractors/')
      .send(contractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request is made and the "contact" property is invalid, then a 400 response should be returned', async () => {
    const contractor = createNewContractor('foomill', 1234, 'foo@gmail.com', '555931888');

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Contact Invalid');
    };

    await request(app)
      .post('/api/contractors/')
      .send(contractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request is made and the "email" property is invalid, then a 400 response should be returned', async () => {
    const contractor = createNewContractor('foomill', 'foo', 'foogmail.com', '555931888');

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Email invalid');
    };

    await request(app)
      .post('/api/contractors/')
      .send(contractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a POST request is made and the "phone" property is invalid, then a 400 response should be returned', async () => {
    const contractor = createNewContractor('foomill', 'foo', 'foo@gmail.com', { phone: 222222 });

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Phone invalid');
    };

    await request(app)
      .post('/api/contractors/')
      .send(contractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
});

describe('Given we have an "/api/contractors/:id" endpoint', () => {
  beforeEach(async () => {
    await Contractor.create(createNewContractor('fooMill', 'foo', 'foo@gmail.com', '1122222'));
  });
  it("When a GET request is made and is valid, authenticated and appropriately authorized, then a 200 response with a contractor's details should be returned", async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const checkBody = (res) => {
      expect(res.body.contractor).toBe('fooMill');
      expect(res.body.contact).toBe('foo');
      expect(res.body.email).toBe('foo@gmail.com');
      expect(res.body.phone).toBe('1122222');
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
      permissions: 'read:contractors',
    });

    await request(app)
      .get(`/api/contractors/${contractorId}`)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a GET request is made and has an invalid token, then a 401 response should be returned', async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: clientId,
      permissions: 'read:contractors',
    });

    await request(app)
      .get(`/api/contractors/${contractorId}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a GET request is made and has insufficient permissions, then a 403 response should be returned', async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
    });

    await request(app)
      .get(`/api/contractors/${contractorId}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a GET request is made and has an invalid "id" parameter, then a 400 response should be returned', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid contractor');
    };

    await request(app)
      .get(`/api/contractors/invalididparam`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a GET request is made and has an "id" parameter that does not exist, then a 404 response should be returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Contractor not found');
    };

    await request(app)
      .get(`/api/contractors/507f191e810c19729de860ea`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });

  it("When a PUT request is made and is valid, authenticated and appropriately authorized, then a 200 response with a contractor's details should be returned", async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const updateContractor = {
      contractor: 'foodMill',
      contact: 'phil',
      email: 'phil@gmail.com',
      phone: '+555 211 122',
    };

    const checkBody = (res) => {
      expect(res.body).toEqual(expect.objectContaining(updateContractor));
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
      permissions: 'update:contractors',
    });

    await request(app)
      .put(`/api/contractors/${contractorId}`)
      .send(updateContractor)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a PUT request is made and has an invalid token, then a 401 response is returned', async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const updateContractor = {
      contractor: 'foodMill',
      contact: 'phil',
      email: 'phil@gmail.com',
      phone: '+555 211 122',
    };

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: clientId,
      permissions: 'update:contractors',
    });

    await request(app)
      .put(`/api/contractors/${contractorId}`)
      .send(updateContractor)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a PUT request is made and has insufficient permissions, then a 403 response is returned', async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const updateContractor = {
      contractor: 'foodMill',
      contact: 'phil',
      email: 'phil@gmail.com',
      phone: '+555 211 122',
    };

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
    });

    await request(app)
      .put(`/api/contractors/${contractorId}`)
      .send(updateContractor)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a PUT request is made and has an invalid update properties, then a 400 response is returned', async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const updateContractor = {
      contractor: 1234156,
      contact: 1234,
      email: 'philmail.com',
      phone: { test: 'test' },
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Contractor Invalid');
      expect(res.body.errors[1].msg).toBe('Contact Invalid');
      expect(res.body.errors[2].msg).toBe('Email invalid');
      expect(res.body.errors[3].msg).toBe('Phone invalid');
    };

    await request(app)
      .put(`/api/contractors/${contractorId}`)
      .send(updateContractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a PUT request is made and has an invalid "id" parameter, then a 400 response is returned', async () => {
    const updateContractor = {
      contractor: 'foodMill',
      contact: 'phil',
      email: 'phil@gmail.com',
      phone: '+555 211 122',
    };

    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid contractor');
    };

    await request(app)
      .put(`/api/contractors/invalidID`)
      .send(updateContractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });

  it('When a PUT request is made and has an "id" parameter that does not exists, then a 400 response is returned', async () => {
    const updateContractor = {
      contractor: 'foodMill',
      contact: 'phil',
      email: 'phil@gmail.com',
      phone: '+555 211 122',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Contractor not found');
    };

    await request(app)
      .put(`/api/contractors/61a7c7537f56a812838f9820`)
      .send(updateContractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
  it('When a PUT request is made and the "contractor" property already exists, then a 409 response is returned', async () => {
    await Contractor.create(createNewContractor('duplicate', 'foo', 'foo@gmail.com', '1122222'));
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const updateContractor = {
      contractor: 'duplicate',
      contact: 'phil',
      email: 'phil@gmail.com',
      phone: '+555 211 122',
    };

    const checkBody = (res) => {
      expect(res.body.message).toBe('Contractor already exists');
    };

    await request(app)
      .put(`/api/contractors/${contractorId}`)
      .send(updateContractor)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(409);
  });
  it('When a DELETE request is made and is valid and authorized, then a 200 response is returned', async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const checkBody = (res) => {
      expect(res.body.message).toBe('Contractor removed!');
    };

    const validToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
      permissions: 'delete:contractors',
    });

    await request(app)
      .delete(`/api/contractors/${contractorId}`)
      .set(`Authorization`, `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });
  it('When a DELETE request is made and is valid and authorized, then a 200 response is returned', async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    await JobDueDate.create({ job: '507f191e810c19729de860ea', jobPartTitle: '507f191e810c19729de860eb', contractors: [contractorId] });

    const checkBody = (res) => {
      expect(res.body.message).toBe('Contractor in use by Due Dates(s)');
    };

    await request(app)
      .delete(`/api/contractors/${contractorId}`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a DELETE request is made and has an invalid token, then a 401 response is returned', async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://{domain}/`,
      sub: clientId,
      permissions: 'delete:contractors',
    });

    await request(app)
      .delete(`/api/contractors/${contractorId}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });
  it('When a DELETE request is made and has insufficient permissions, then a 403 response is returned', async () => {
    const contractor = await Contractor.findOne({ contractor: 'fooMill' });
    const contractorId = contractor._id;

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const invalidToken = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
    });

    await request(app)
      .delete(`/api/contractors/${contractorId}`)
      .set(`Authorization`, `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });
  it('When a DELETE request is made and has an invalid "id" parameter, then a 400 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.errors[0].msg).toBe('Invalid contractor');
    };

    await request(app)
      .delete(`/api/contractors/invalidid`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
  it('When a DELETE request is made and has an "id" parameter that does not exist, then a 404 response is returned', async () => {
    const checkBody = (res) => {
      expect(res.body.message).toBe('Contractor not found');
    };

    await request(app)
      .delete(`/api/contractors/507f191e810c19729de860ea`)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(404);
  });
});

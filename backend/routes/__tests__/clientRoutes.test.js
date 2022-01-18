const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: createJWKSMock } = require('mock-jwks');

const app = require('../../app');
const database = require('../../config/database');
const { domain, audience } = require('../../config/env');
const Client = require('../../models/clientModel');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
  jwks.start();
});

afterEach(async () => {
  await Client.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  jwks.stop();
});

const jwks = createJWKSMock(`https://${domain}/`);
const clientId = 'test|123456';

const createNewClient = (clientName, color = '#21bd03', contact = {}) => {
  return {
    clientName: clientName,
    color: color,
    contact: contact,
  };
};

describe('Given we have an "/api/users" endpoint', () => {
  it('When a valid, authenticated and appropriately authorized GET request is made then a 200 response with a list of clients should be returned', async () => {
    for (let i = 0; i < 20; i++) {
      await Client.create(createNewClient(`client${i}`));
    }

    const checkBody = (res) => {
      expect(res.body.error).toBeUndefined();
      expect(res.body.length).toBe(20);
    };

    const token = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
      permissions: 'read:clients',
    });

    await request(app)
      .get('/api/clients/')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(200);
  });

  it('When a GET request is made with an insufficient scope then a 401 response with an error is returned', async () => {
    for (let i = 0; i < 2; i++) {
      await Client.create(createNewClient(`client${i}`));
    }

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const token = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
    });

    await request(app)
      .get('/api/clients/')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });

  it('When a GET request is made with an invalid token, then a 403 response with an error is returned', async () => {
    for (let i = 0; i < 2; i++) {
      await Client.create(createNewClient(`client${i}`));
    }

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const token = jwks.token({
      aud: audience,
      iss: `https://domain/`,
      sub: clientId,
    });

    await request(app)
      .get('/api/clients/')
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });

  it('When a valid, authenticated and appropriately authorized POST request is made then a 201 response returned', async () => {
    const client = createNewClient('Spark', '#21502c', { email: 'abc@abc.com', name: 'abc' });

    const checkBody = (res) => {
      expect(res.body.error).toBeUndefined();
      expect(res.body.message).toBe('Client created');
      expect(res.body.client).toEqual(expect.objectContaining(client));
    };

    const token = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
      permissions: 'write:clients',
    });

    await request(app)
      .post('/api/clients/')
      .send(client)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(201);
  });

  it('When a POST request is made with an insufficient scope then a 403 response with an error is returned', async () => {
    const client = createNewClient('Spark', '#21502c', { email: 'abc@abc.com', name: 'abc' });

    const checkBody = (res) => {
      expect(res.body.error).toBe('Forbidden');
    };

    const token = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
    });

    await request(app)
      .post('/api/clients/')
      .send(client)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(403);
  });

  it('When a POST request is made with an invalid token then a 401 response with an error is returned', async () => {
    const client = createNewClient('Spark', '#21502c', { email: 'abc@abc.com', name: 'abc' });

    const checkBody = (res) => {
      expect(res.body.code).toBe('invalid_token');
    };

    const token = jwks.token({
      aud: 'audience',
      iss: `https://${domain}/`,
      sub: clientId,
      permissions: 'write:clients',
    });

    await request(app)
      .post('/api/clients/')
      .send(client)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(401);
  });

  it('When a POST request is made and the clientName already exists then a 400 response with an error is returned', async () => {
    const client = createNewClient('Spark', '#21502c', { email: 'abc@abc.com', name: 'abc' });

    await Client.create(client);

    const checkBody = (res) => {
      expect(res.body.message).toBe('Client already exists!');
      expect(res.body.statusCode).toBe(400);
    };

    const token = jwks.token({
      aud: audience,
      iss: `https://${domain}/`,
      sub: clientId,
      permissions: 'write:clients',
    });

    await request(app)
      .post('/api/clients/')
      .send(client)
      .set(`Authorization`, `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(checkBody)
      .expect(400);
  });
});

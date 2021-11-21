const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const database = require('../../config/database');
const { MongoMemoryServer } = require('mongodb-memory-server');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Given we have a GET /api/jobdetails endpoint', () => {
  it('When a valid request is made then a 200 response with a list of jobs should be returned', async () => {
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

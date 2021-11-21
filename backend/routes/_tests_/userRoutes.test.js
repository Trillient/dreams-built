const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');

const database = require('../../config/database');
const User = require('../../models/userModel');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
});

const token = process.env.AUTH0_TEST_TOKEN;

const createNewUser = (userId, firstName, lastName, email = 'abc@gmail.com', phoneNumber = 2111111, isAdmin = false, birthDate = '10-10-2020', hourlyRate = 10, startDate = '10-01-2020') => {
  return {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    isAdmin: isAdmin,
    birthDate: birthDate,
    hourlyRate: hourlyRate,
    startDate: startDate,
  };
};

describe('Given we have an "/api/users" endpoint', () => {
  describe('and make a GET request, ', () => {
    it('When a valid request is made then a 200 response with a list of jobs should be returned', async () => {
      const newUser = createNewUser(1, 'mary', 'doe', 'mary@gmail.com');
      const row = new User(newUser);
      await row.save();

      const checkBody = (res) => {
        expect(res.body.length).toBe(1);
        expect(res.body[0].firstName).toBe('mary');
      };

      await request(app)
        .get('/api/users')
        // .set(`Authorization`, `Bearer ${token}`) //TODO set token
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });
  describe('and a POST method', () => {
    it('when an valid request is made then return a 200 response with the created user info', async () => {
      const newUser = createNewUser(2, 'john', 'Doe');

      const checkBody = (res) => {
        expect(res.body.firstName).toBe('john');
        expect(res.body.lastName).toBe('Doe');
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        // .set(`Authorization`, `Bearer ${token}`) //TODO set token
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(201);
    });
  });
});

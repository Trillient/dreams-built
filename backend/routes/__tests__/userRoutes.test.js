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

//TODO - Add error and edgecase tests

/**
 * @Route /api/users
 */
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
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it.todo('When a request is made without a valid admin token then a 403 response should be returned');
    it.todo('When a request is made and there are no users then should return a 200 response with an empty array');
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
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(201);
    });
    it.todo('when a request is made without a required field then should return a 400 response with an error message');
    it.todo('when a request is made with an email that is not unique then should return a 400 response with an error message');
  });
});

/**
 * @Route /api/users/:id
 */
describe('Given we have an "/api/users/:id" endpoint', () => {
  describe('and a GET method', () => {
    it("when a valid request is made then it should return a 200 response with the user's details", async () => {
      const newUser = createNewUser(5, 'oscar', 'doe', 'oscar@gmail.com');
      const row = new User(newUser);
      await row.save();

      const user = await User.findOne({ email: 'oscar@gmail.com' });
      const userParams = await user._id;

      const checkBody = (res) => {
        expect(res.body.firstName).toBe('oscar');
        expect(res.body.email).toBe('oscar@gmail.com');
      };

      await request(app)
        .get(`/api/users/${userParams}`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });
  describe('and a PUT method', () => {
    it('when a valid request is made then it should return a 200 response with an updated user', async () => {
      const newUser = createNewUser(6, 'jaople', 'doe', 'jap@gmail.com');
      const row = new User(newUser);
      await row.save();

      const user = await User.findOne({ email: 'jap@gmail.com' });
      const userParams = await user._id;

      const updatedUserDetails = {
        email: 'newemail@gmail.com',
      };

      const checkBody = (res) => {
        expect(res.body.firstName).toBe('jaople');
        expect(res.body.email).toBe('newemail@gmail.com');
      };

      await request(app)
        .put(`/api/users/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });

  describe('and a DELETE method', () => {
    it('when a valid request is made then it should return with a 200 repsonse and delete the user', async () => {
      const newUser = createNewUser(7, 'allen', 'doe', 'allen@gmail.com');
      const row = new User(newUser);
      await row.save();

      const user = await User.findOne({ email: 'allen@gmail.com' });

      const checkBody = (res) => {
        expect(res.body.message).toBe('User removed');
      };

      await request(app)
        .delete(`/api/users/${user._id}`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });
});

/**
 * @Route /api/users/profile/:id
 */

describe('Given we have an "/api/users/profile/:id" endpoint', () => {
  describe('and a GET method', () => {
    it("when a valid request is made then it should return a 200 response with the user's details", async () => {
      const newUser = createNewUser(9, 'falter', 'doe', 'falter@gmail.com');
      const row = new User(newUser);
      await row.save();

      const user = await User.findOne({ email: 'falter@gmail.com' });

      const checkBody = (res) => {
        expect(res.body.firstName).toBe('falter');
        expect(res.body.email).toBe('falter@gmail.com');
        expect(res.body.hourlyPay).toBeUndefined();
      };

      await request(app)
        .get(`/api/users/profile/${user._id}`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });

  describe('and a PUT method', () => {
    it('when a valid request is made then it should return a 200 response with an updated user', async () => {
      const newUser = createNewUser(12, 'craig', 'doe', 'craig@gmail.com');
      const row = new User(newUser);
      await row.save();

      const user = await User.findOne({ email: 'craig@gmail.com' });
      const userParams = await user._id;

      const updatedUserDetails = {
        email: 'kraig@gmail.com',
      };

      const checkBody = (res) => {
        expect(res.body.firstName).toBe('craig');
        expect(res.body.email).toBe('kraig@gmail.com');
        expect(res.body.hourlyPay).toBeUndefined();
      };

      await request(app)
        .put(`/api/users/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
  });
});
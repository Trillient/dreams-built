const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: createJWKSMock } = require('mock-jwks');

const database = require('../../config/database');
const { domain, audience } = require('../../config/env');

const User = require('../../models/userModel');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await database.connect(mongoServer.getUri());
  jwks.start();
});

beforeEach(async () => {
  await User.create(createNewUser(clientId, 'foo', 'fighter', 'foo@gmail.com'));
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  jwks.stop();
  await mongoose.connection.close();
});

const jwks = createJWKSMock(`https://${domain}/`);
const clientId = 'test|123456';
const token = jwks.token({
  aud: audience,
  iss: `https://${domain}/`,
  sub: clientId,
  permissions: ['read:users', 'create:users', 'update:users', 'delete:users', 'read:user_profile', 'update:user_profile'],
});

const createNewUser = (userId, firstName, lastName, auth0Email = 'abc@gmail.com') => {
  return {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    auth0Email: auth0Email,
  };
};

/**
 * @Route /api/users
 */
describe('Given we have an "/api/users" endpoint', () => {
  describe('and make a GET request, ', () => {
    it('When the request does not have a valid token, then a 401 response is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: clientId,
        permissions: 'read:users',
      });

      await request(app)
        .get('/api/users')
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('When a request is made without a valid admin token then a 403 response should be returned', async () => {
      const checkBody = (res) => {
        expect(res.body.error).toBe('Forbidden');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
      });

      await request(app)
        .get('/api/users')
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
  });
  describe('and a POST method', () => {
    it('when an valid request is made then return a 200 response with the created user info', async () => {
      const newUser = createNewUser('3', 'john', 'Doe', 'john@gmail.com');

      const checkBody = (res) => {
        expect(res.body.firstName).toBe('john');
        expect(res.body.lastName).toBe('Doe');
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(201);
    });
    it('When a request has no userId, then a 400 response is returned', async () => {
      const newUser = createNewUser(null, 'john', 'Doe', 'john@gmail.com');

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('userId required');
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('When a duplicate userId is sent, then a 400 response is returned', async () => {
      const newUser = createNewUser('2', 'john', 'Doe', 'john@gmail.com');

      await User.create({
        userId: '2',
        auth0Email: 'test@abc.com',
      });

      const checkBody = (res) => {
        expect(res.body.message).toBe('Invalid user data');
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
  });
});

/**
 * @Route /api/users/:id
 */
describe('Given we have an "/api/users/:id" endpoint', () => {
  describe('and a PUT method', () => {
    it('when a valid request is made then it should return a 200 response with an updated user', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = await user._id;

      const updatedUserDetails = {
        auth0Email: 'newemail@gmail.com',
        hourlyRate: 25,
        firstName: 'New',
      };

      const checkBody = (res) => {
        expect(res.body).toEqual(expect.objectContaining(updatedUserDetails));
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
        permissions: 'update:users',
      });

      await request(app)
        .put(`/api/users/user/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it('when a request has an invalid token, then it should return a 401 response', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = await user._id;

      const updatedUserDetails = {
        auth0Email: 'newemail@gmail.com',
        hourlyRate: 25,
        firstName: 'New',
      };

      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: clientId,
        permissions: 'update:users',
      });

      await request(app)
        .put(`/api/users/user/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('when a request has insufficient permissions, then it should return a 403 respone', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = await user._id;

      const updatedUserDetails = {
        auth0Email: 'newemail@gmail.com',
        hourlyRate: 25,
        firstName: 'New',
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
        .put(`/api/users/user/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
    it('when a request has an invalid "firstName" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = await user._id;

      const updatedUserDetails = {
        auth0Email: 'newemail@gmail.com',
        hourlyRate: 25,
        firstName: { name: 'foo' },
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('First Name must be valid');
      };

      await request(app)
        .put(`/api/users/user/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('when a request has an invalid "lastName" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = await user._id;

      const updatedUserDetails = {
        auth0Email: 'newemail@gmail.com',
        hourlyRate: 25,
        firstName: 'foo',
        lastName: 3333,
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Last Name must be valid');
      };

      await request(app)
        .put(`/api/users/user/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('when a request has an invalid "auth0Email" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = await user._id;

      const updatedUserDetails = {
        auth0Email: 'newemailgmail.com',
        hourlyRate: 25,
        firstName: 'foo',
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Must enter a valid email');
      };

      await request(app)
        .put(`/api/users/user/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('when a request has an invalid "hourlyRate" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = await user._id;

      const updatedUserDetails = {
        auth0Email: 'newemail@gmail.com',
        hourlyRate: 'a25',
        firstName: 'foo',
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Hourly Rate must be a valid number');
      };

      await request(app)
        .put(`/api/users/user/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('when a request has an invalid "id" parameter, then a 400 response is returned', async () => {
      const updatedUserDetails = {
        auth0Email: 'newemail@gmail.com',
        hourlyRate: 25,
        firstName: 'foo',
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Invalid user');
      };

      await request(app)
        .put(`/api/users/user/{userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('when a request has an "id" property that does not exist, then a 404 response is returned', async () => {
      const updatedUserDetails = {
        auth0Email: 'newemail@gmail.com',
        hourlyRate: 25,
        firstName: 'foo',
      };

      const checkBody = (res) => {
        expect(res.body.message).toBe('User not found');
      };

      await request(app)
        .put(`/api/users/user/507f191e810c19729de860ea`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(404);
    });
  });

  describe('and a DELETE method', () => {
    it('when a valid request is made then it should return with a 200 repsonse and delete the user', async () => {
      const user = await User.findOne({ email: 'foo@gmail.com' });

      const checkBody = (res) => {
        expect(res.body.message).toBe('User removed');
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
        permissions: 'delete:users',
      });

      await request(app)
        .delete(`/api/users/user/${user._id}`)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it('when a request has in invalid token, then a 401 response is returned', async () => {
      const user = await User.findOne({ email: 'foo@gmail.com' });

      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: clientId,
        permissions: 'delete:users',
      });

      await request(app)
        .delete(`/api/users/user/${user._id}`)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('when a request has insufficient permissions, then a 403 response is returned', async () => {
      const user = await User.findOne({ email: 'foo@gmail.com' });

      const checkBody = (res) => {
        expect(res.body.error).toBe('Forbidden');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
      });

      await request(app)
        .delete(`/api/users/user/${user._id}`)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
    it('when a request has an invalid "id" parameter, then a 400 response is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Invalid user');
      };

      await request(app)
        .delete(`/api/users/user/{user._id}`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('when a request has an "id" parameter that does not exist, then a 404 response is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.message).toBe('User not found');
      };

      await request(app)
        .delete(`/api/users/user/507f191e810c19729de860ea`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(404);
    });
  });
});

/**
 * @Route /api/users/profile/:id
 */

describe('Given we have an "/api/users/profile/:id" endpoint', () => {
  describe('and a GET method', () => {
    it("when a valid request is made then it should return a 200 response with the user's details", async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });

      const checkBody = (res) => {
        expect(res.body.firstName).toBe('foo');
        expect(res.body.auth0Email).toBe('foo@gmail.com');
        expect(res.body.hourlyPay).toBeUndefined();
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
        permissions: 'read:user_profile',
      });

      await request(app)
        .get(`/api/users/profile/${user.userId}`)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it('when a request has an invalid token, then a 401 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });

      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: clientId,
        permissions: 'read:user_profile',
      });

      await request(app)
        .get(`/api/users/profile/${user.userId}`)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('when a request has insufficient permissions, then a 403 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });

      const checkBody = (res) => {
        expect(res.body.error).toBe('Forbidden');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
      });

      await request(app)
        .get(`/api/users/profile/${user.userId}`)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });

    it('when a request has a "id" paramtere that does not exist, then a 404 response is returned', async () => {
      const checkBody = (res) => {
        expect(res.body.message).toBe('User not found');
      };

      await request(app)
        .get(`/api/users/profile/507f191e810c19729de860ea`)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(404);
    });
  });

  describe('and a PUT method', () => {
    it('when a valid request is made then it should return a 200 response with an updated user', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = user.userId;

      const updatedUserDetails = {
        firstName: user.firstName,
        lastName: 'allan',
      };

      const checkBody = async (res) => {
        expect(res.body.message).toBe('Details updated!');
        const savedResult = await User.findOne({ userId: userParams });
        expect(savedResult.lastName).toBe(updatedUserDetails.lastName);
      };

      const validToken = jwks.token({
        aud: audience,
        iss: `https://${domain}/`,
        sub: clientId,
        permissions: 'update:user_profile',
      });

      await request(app)
        .put(`/api/users/profile/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(200);
    });
    it('when a request has an invalid token, then a 401 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = user.userId;

      const updatedUserDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        auth0Email: 'kraig@gmail.com',
      };

      const checkBody = (res) => {
        expect(res.body.code).toBe('invalid_token');
      };

      const invalidToken = jwks.token({
        aud: audience,
        iss: `https://{domain}/`,
        sub: clientId,
        permissions: 'update:user_profile',
      });

      await request(app)
        .put(`/api/users/profile/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(401);
    });
    it('when a request has insufficient permissions, then a 403 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = await user.userId;

      const updatedUserDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        auth0Email: 'kraig@gmail.com',
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
        .put(`/api/users/profile/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(403);
    });
    it('when a request has an invalid "firstName" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = user.userId;

      const updatedUserDetails = {
        firstName: 11111,
        lastName: user.lastName,
        auth0Email: 'kraig@gmail.com',
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('First Name must be valid');
      };

      await request(app)
        .put(`/api/users/profile/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('when a request has an invalid "lastName" proeprty, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = user.userId;

      const updatedUserDetails = {
        firstName: user.firstName,
        lastName: 11111,
        auth0Email: 'kraig@gmail.com',
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Last Name must be valid');
      };

      await request(app)
        .put(`/api/users/profile/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });
    it('when a request has an invalid "auth0Email" property, then a 400 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });
      const userParams = user.userId;

      const updatedUserDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        auth0Email: 'kraiggmail.com',
      };

      const checkBody = (res) => {
        expect(res.body.errors[0].msg).toBe('Must enter a valid email');
      };

      await request(app)
        .put(`/api/users/profile/${userParams}`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(400);
    });

    it('when a request has an "id" parameter that does not exist, then a 404 response is returned', async () => {
      const user = await User.findOne({ auth0Email: 'foo@gmail.com' });

      const updatedUserDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        auth0Email: 'kraig@gmail.com',
      };

      const checkBody = (res) => {
        expect(res.body.message).toBe('User not found');
      };

      await request(app)
        .put(`/api/users/profile/507f191e810c19729de860ea`)
        .send(updatedUserDetails)
        .set(`Authorization`, `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(checkBody)
        .expect(404);
    });
  });
});

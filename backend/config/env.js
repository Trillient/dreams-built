const dotenv = require('dotenv');

dotenv.config();

const audience = process.env.AUTH0_AUDIENCE;
const domain = process.env.AUTH0_DOMAIN;
const auth0ClientId = process.env.AUTH0_CLIENT_ID;
const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;

if (!audience) {
  throw new Error('Missing the definition of an AUDIENCE environmental variable');
}

if (!domain) {
  throw new Error('Missing the definition of a DOMAIN environmental variable');
}

if (!auth0ClientId) {
  throw new Error('Missing the definition of an AUTH0_CLIENT_ID environmental variable');
}

if (!auth0ClientSecret) {
  throw new Error('Missing the definition of an AUTH0_CLIENT_SECRET environmental variable');
}

module.exports = {
  audience,
  domain,
  auth0ClientId,
  auth0ClientSecret,
};

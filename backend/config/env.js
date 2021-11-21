const dotenv = require('dotenv');

dotenv.config();

const audience = process.env.AUTH0_AUDIENCE;
const domain = process.env.AUTH0_DOMAIN;

if (!audience) {
  throw new Error('Missing the definition of an AUDIENCE environmental variable');
}

if (!domain) {
  throw new Error('Missing the definition of a DOMAIN environmental variable');
}

module.exports = {
  audience,
  domain,
};

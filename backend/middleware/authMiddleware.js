const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

const { domain, audience } = require('../config/env');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),

  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ['RS256'],
});

const readClients = jwtAuthz(['read:clients'], { failWithError: true });
const writeClients = jwtAuthz(['write:clients'], { failWithError: true });

module.exports = { checkJwt, readClients, writeClients };

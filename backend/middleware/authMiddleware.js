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

const options = { customScopeKey: 'permissions', failWithError: true };

const readClientsAuth = jwtAuthz(['read:clients'], options);
const createClientsAuth = jwtAuthz(['create:clients'], options);

const readJobDetailsAuth = jwtAuthz(['read:jobs'], options);
const createJobDetailsAuth = jwtAuthz(['create:jobs'], options);
const updateJobDetailsAuth = jwtAuthz(['update:jobs'], options);
const deleteJobDetailsAuth = jwtAuthz(['delete:jobs'], options);

const readJobPartsAuth = jwtAuthz(['read:job_parts'], options);
const createJobPartsAuth = jwtAuthz(['create:job_parts'], options);
const updateJobPartsAuth = jwtAuthz(['update:job_parts'], options);
const deleteJobPartsAuth = jwtAuthz(['delete:job_parts'], options);

module.exports = {
  checkJwt,
  readClientsAuth,
  createClientsAuth,
  readJobDetailsAuth,
  createJobDetailsAuth,
  updateJobDetailsAuth,
  deleteJobDetailsAuth,
  readJobPartsAuth,
  updateJobPartsAuth,
  createJobPartsAuth,
  deleteJobPartsAuth,
};

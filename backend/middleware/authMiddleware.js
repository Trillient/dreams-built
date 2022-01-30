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

const readJobPartDueDatesAuth = jwtAuthz(['read:due_dates'], options);
const createJobPartDueDatesAuth = jwtAuthz(['create:due_dates'], options);
const updateJobPartDueDatesAuth = jwtAuthz(['update:due_dates'], options);
const deleteJobPartDueDatesAuth = jwtAuthz(['delete:due_dates'], options);

const readTimesheetAuth = jwtAuthz(['read:timesheet'], options);
const createTimesheetAuth = jwtAuthz(['create:timesheet'], options);
const readAllUserTimesheetAuth = jwtAuthz(['admin_read:timesheet'], options);
const createAllUserTimesheetAuth = jwtAuthz(['admin_create:timesheet'], options);
const updateAllUserTimesheetAuth = jwtAuthz(['admin_update:timesheet'], options);
const deleteAllUserTimesheetAuth = jwtAuthz(['admin_delete:timesheet'], options);

const readUsersAuth = jwtAuthz(['read:users'], options);
const createUsersAuth = jwtAuthz(['create:users'], options);
const updateUsersAuth = jwtAuthz(['update:users'], options);
const deleteUsersAuth = jwtAuthz(['delete:users'], options);
const readProfileAuth = jwtAuthz(['read:user_profile'], options);
const updateProfileAuth = jwtAuthz(['update:user_profile'], options);

const readContractorsAuth = jwtAuthz(['read:contractors'], options);
const createContractorsAuth = jwtAuthz(['create:contractors'], options);
const updateContractorsAuth = jwtAuthz(['update:contractors'], options);
const deleteContractorsAuth = jwtAuthz(['delete:contractors'], options);

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
  readJobPartDueDatesAuth,
  updateJobPartDueDatesAuth,
  createJobPartDueDatesAuth,
  deleteJobPartDueDatesAuth,
  readTimesheetAuth,
  createTimesheetAuth,
  readAllUserTimesheetAuth,
  createAllUserTimesheetAuth,
  updateAllUserTimesheetAuth,
  deleteAllUserTimesheetAuth,
  readUsersAuth,
  createUsersAuth,
  updateUsersAuth,
  deleteUsersAuth,
  readProfileAuth,
  updateProfileAuth,
  readContractorsAuth,
  createContractorsAuth,
  updateContractorsAuth,
  deleteContractorsAuth,
};

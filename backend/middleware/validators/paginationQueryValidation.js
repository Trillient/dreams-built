const { query } = require('express-validator');

const paginationQuery = [
  query('page', 'Page Query must be a Number').optional({ checkFalsy: true }).isInt({ min: 0 }),
  query('limit', 'Limit Query must be a Number').optional({ checkFalsy: true }).isInt({ min: 1 }),
  query('keyword', 'Keyword Query must be a String').optional({ checkFalsy: true }).isString(),
];

module.exports = {
  paginationQuery,
};

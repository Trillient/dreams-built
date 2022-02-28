const { query } = require('express-validator');

const paginationQuery = [
  query('page', 'Page Query must be a Number').optional().isInt({ min: 0 }),
  query('limit', 'Limit Query must be a Number').optional().isInt({ min: 1 }),
  query('keyword', 'Keyword Query must be a String').optional().isString(),
];

module.exports = {
  paginationQuery,
};

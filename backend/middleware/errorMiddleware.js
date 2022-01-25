const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode ? err.status || err.statusCode : res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    error: err.error,
    code: err.code,
    name: err.name,
    statusCode: statusCode,
    message: err.message,
  });
};

module.exports = { notFound, errorHandler };

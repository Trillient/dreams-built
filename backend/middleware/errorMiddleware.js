const authorizationError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(403);
  }
  next(err);
};

const idNotFound = (err, req, res, next) => {
  if (err.message.indexOf('Cast to ObjectId failed') !== -1) {
    res.status(404);
    console.log(res);
    throw new Error(`Resource not found`);
  } else {
    next(err);
  }
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    statusCode: statusCode,
    message: err.message,
  });
};

module.exports = { authorizationError, idNotFound, notFound, errorHandler };

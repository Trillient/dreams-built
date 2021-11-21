const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

//const timesheetRoutes = require('./routes/timeSheetRoutes.js');
const jobDetailRoutes = require('./routes/jobDetailsRoutes');
// const userRoutes = require('./routes/userRoutes.js');
const { checkJwt } = require('./middleware/authMiddleware');
const { errorHandler, notFound, authorizationError } = require('./middleware/errorMiddleware.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//app.use('/api/timesheet', timesheetRoutes);
app.use('/api/jobDetails', checkJwt, jobDetailRoutes);

app.get('/', (req, res) => {
  res.json('API running...');
});

app.use(authorizationError);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

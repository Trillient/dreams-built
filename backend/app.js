const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

const jobDetailRoutes = require('./routes/jobDetailsRoutes');
const timesheetRoutes = require('./routes/timeSheetRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const clientRoutes = require('./routes/clientRoutes');
const { checkJwt } = require('./middleware/authMiddleware');
const { errorHandler, notFound, authorizationError, idNotFound } = require('./middleware/errorMiddleware.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// app.use(checkJwt);
app.use(authorizationError);

app.use('/api/users', userRoutes);
app.use('/api/timesheet', timesheetRoutes);
app.use('/api/job', jobDetailRoutes);
app.use('/api/clients', clientRoutes);

app.get('/', (req, res) => {
  res.json('API running...');
});

app.use(idNotFound);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

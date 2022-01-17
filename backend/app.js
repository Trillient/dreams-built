const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

const jobDetailRoutes = require('./routes/jobDetailsRoutes');
const timesheetRoutes = require('./routes/timeSheetRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const clientRoutes = require('./routes/clientRoutes');
const { checkJwt } = require('./middleware/authMiddleware');
const { errorHandler, notFound, idNotFound } = require('./middleware/errorMiddleware.js');

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(checkJwt);

app.use('/api/users', userRoutes);
app.use('/api/timesheet', timesheetRoutes);
app.use('/api/job', jobDetailRoutes);
app.use('/api/clients', clientRoutes);

app.use(idNotFound);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

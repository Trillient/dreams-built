import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorMiddleware.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
// import timesheetRoutes from './routes/timeSheetRoutes.js';
// import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/timesheet', timesheetRoutes);

app.get(
  '/',
  (req,
  (res) => {
    res.send('hello world');
  })
);

app.use(errorHandler);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

export default app;

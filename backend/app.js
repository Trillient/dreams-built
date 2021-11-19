import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// import timesheetRoutes from './routes/timeSheetRoutes.js';
// import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  import morgan from 'morgan';
  app.use(morgan('dev'));
}

// app.use('/api/timesheet', timesheetRoutes);

app.get('/', (req, res) => {
  res.json('API running...');
});

app.use(errorHandler);

export default app;

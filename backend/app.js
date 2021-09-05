import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/timesheet", timesheetRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

export default app;

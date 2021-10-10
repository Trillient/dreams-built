import app from './app.js';
// import { connect } from "./database.js";
// connect();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

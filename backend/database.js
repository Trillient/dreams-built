import mongoose from "mongoose";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:${MONGO_PORT}`;
let mongoUri = `${MONGO_URL}/dreamsbuilt`;
let _connection;

const mongoOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connection.on("error", (e) => {
  if (e.message.code === "ETIMEDOUT") {
    console.error(e);
    mongoose.connect(mongoUri, mongooseOpts);
    return;
  }
  console.error(e);
});

mongoose.connection.once("open", (e) => {
  console.info(`MongoDB successfully connected to ${mongoUri}`);
});

/**
 * Connects to a mongo instance.
 * @param {uri} uriOverride - overrides configuration (for tests)
 * @returns {Promise} connection
 */

const connect = async (uriOverride) => {
  // return stashed connection
  if (_connection) {
    return _connection;
  }

  // lazy instatiate
  mongoUri = uriOverride || mongoUri;
  _connection = await mongoose.connect(mongoUri, mongoOpts);
  return _connection;
};

/**
 * Disconnects from the mongo database
 */

const disconnect = async () => {
  await mongoose.disconnect();
};

exports = {
  connect,
  disconnect,
};

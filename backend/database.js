import mongoose from 'mongoose';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:${MONGO_PORT}`;
let mongoUri = `${MONGO_URL}/dreamsbuilt`;
let _connection;

mongoose.connection.on('error', (e) => {
  if (e.message.code === 'ETIMEDOUT') {
    console.error(e);
    mongoose.connect(mongoUri);
    return;
  }
  console.error(e);
});

mongoose.connection.once('open', (e) => {
  console.info(`MongoDB successfully connected to ${mongoUri}`);
});

const connect = async (uriOverride) => {
  // return stashed connection
  if (_connection) {
    return _connection;
  }

  // lazy instatiate
  mongoUri = uriOverride || mongoUri;
  _connection = await mongoose.connect(mongoUri);
  return _connection;
};

const disconnect = async () => {
  await mongoose.disconnect();
};

export { connect, disconnect };

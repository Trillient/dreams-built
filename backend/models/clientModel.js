const mongoose = require('mongoose');

const clientSchema = mongoose.Schema(
  {
    clientName: { type: String, required: true, unique: true },
    color: String,
    contact: { email: { type: String }, name: { type: String } },
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

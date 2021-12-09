const mongoose = require('mongoose');

const clientSchema = mongoose.Schema(
  {
    clientName: { type: String, required: true, unique: true },
    color: String,
    contacts: [{ email: String, name: String }],
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

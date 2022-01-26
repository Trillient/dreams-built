const mongoose = require('mongoose');

const contractorSchema = mongoose.Schema(
  {
    contractor: { type: String, required: true, unique: true },
    contact: { type: String },
    email: { type: String },
    phone: { type: String || Number },
  },
  { timestamps: true }
);

const Contractor = mongoose.model('Contractor', contractorSchema);

module.exports = Contractor;

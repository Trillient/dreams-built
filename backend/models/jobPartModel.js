const mongoose = require('mongoose');

const jobPartSchema = mongoose.Schema(
  {
    jobPartTitle: { type: String, required: true },
    jobOrder: { type: Number, required: true },
    jobDescription: { type: String },
  },
  { timestamps: true }
);

const JobPart = mongoose.model('JobPart', jobPartSchema);

module.exports = JobPart;

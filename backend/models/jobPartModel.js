const mongoose = require('mongoose');

const jobPartSchema = mongoose.Schema(
  {
    jobPartTitle: { type: String, required: true },
    jobDescription: String,
  },
  { timestamps: true }
);

const JobPart = mongoose.model('JobPart', jobPartSchema);

module.exports = JobPart;

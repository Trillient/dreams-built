const mongoose = require('mongoose');

const jobPartSchema = mongoose.Schema(
  {
    jobPartTitle: { type: String, required: true },
    jobOrder: Number,
    jobDescription: String,
  },
  { timestamps: true }
);

const JobPart = mongoose.model('JobPart', jobPartSchema);

module.exports = JobPart;

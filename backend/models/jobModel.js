const mongoose = require('mongoose');

const jobDueDate = mongoose.Schema({
  jobDescription: String,
  dueDate: String,
  contractor: String,
});

const jobSchema = mongoose.Schema(
  {
    jobNumber: { type: Number, required: true, unique: true, min: 22000 },
    company: String,
    address: String,
    city: String,
    client: String,
    area: Number,
    isInvoiced: { type: Boolean, default: false },
    dueDates: [jobDueDate],
  },
  { timestamps: true }
);

const JobDetails = mongoose.model('JobDetails', jobSchema);

module.exports = JobDetails;

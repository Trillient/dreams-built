const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    jobNumber: { type: Number, required: true, unique: true, min: 22000 },
    company: String,
    address: String,
    city: String,
    client: String,
    area: Number,
    isInvoiced: { type: Boolean, default: false },
    dueDates: [
      {
        jobDescription: String,
        dueDate: Date,
        contractor: String,
      },
    ],
  },
  { timestamps: true }
);

const JobDetails = mongoose.model('JobDetails', jobSchema);

module.exports = JobDetails;

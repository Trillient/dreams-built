const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    jobNumber: { type: Number, required: true, unique: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
    },
    address: { type: String, required: true, unique: true },
    city: { type: String },
    area: { type: Number },
    endClient: { type: String },
    color: { type: String, required: true },
    isInvoiced: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const JobDetails = mongoose.model('JobDetails', jobSchema);

module.exports = JobDetails;

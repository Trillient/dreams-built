const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    jobNumber: { type: Number, required: true, unique: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
    },
    address: { type: String },
    city: { type: String },
    area: { type: Number },
    endClient: { type: String },
    color: { type: String },
    isInvoiced: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const JobDetails = mongoose.model('JobDetails', jobSchema);

module.exports = JobDetails;

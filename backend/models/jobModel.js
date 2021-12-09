const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    jobNumber: { type: Number, required: true, unique: true, min: 22000 },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
    },
    address: String,
    city: String,
    area: Number,
    endClient: String,
    color: String,
    isInvoiced: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const JobDetails = mongoose.model('JobDetails', jobSchema);

module.exports = JobDetails;

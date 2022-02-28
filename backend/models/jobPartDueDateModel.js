const mongoose = require('mongoose');

const jobDueDateSchema = mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'JobDetails',
    },
    jobPartTitle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'JobPart',
    },
    dueDate: { type: String },
    startDate: { type: String },
    dueDateRange: [{ type: Date }],
    details: { type: String },
    contractors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' }],
  },
  { timestamps: true }
);

jobDueDateSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 15811200 });

const JobDueDate = mongoose.model('JobDueDate', jobDueDateSchema);

module.exports = JobDueDate;

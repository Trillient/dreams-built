const mongoose = require('mongoose');

const jobDueDateSchema = mongoose.Schema({
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
  dueDate: String,
  dueDateRange: Date,
  contractor: String,
});

const JobDueDate = mongoose.model('JobDueDate', jobDueDateSchema);

module.exports = JobDueDate;

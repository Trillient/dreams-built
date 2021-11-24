const mongoose = require('mongoose');

const jobDueDateSchema = mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'JobDetails',
  },
  jobDescription: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'JobPart',
  },
  dueDate: String,
  contractor: String,
});

const JobDueDateDetail = mongoose.model('JobDueDateDetail', jobDueDateSchema);

module.exports = JobDueDateDetail;

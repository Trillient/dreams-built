const mongoose = require('mongoose');

const timesheetEntrySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'JobDetails',
    },
    userId: { type: String, required: true },
    entryId: { type: String, required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    jobNumber: { type: Number, required: true },
    jobTime: { type: Number, required: true },
    weekStart: { type: String, required: true },
    weekEnd: { type: String },
    isArchive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

timesheetEntrySchema.index({ updatedAt: 1 }, { expireAfterSeconds: 15811200 });

const TimesheetEntry = mongoose.model('TimesheetEntry', timesheetEntrySchema);

module.exports = TimesheetEntry;

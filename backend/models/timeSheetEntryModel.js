const mongoose = require('mongoose');

const timeSheetEntrySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    userId: { type: String, required: true },
    entryId: { type: String, required: true },
    day: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    jobNumber: { type: Number, required: true },
    jobTime: { type: Number, required: true },
    weekStart: { type: String, required: true },
    weekEnd: { type: String, required: true },
    isArchive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TimeSheetEntry = mongoose.model('TimeSheetEntry', timeSheetEntrySchema);

module.exports = TimeSheetEntry;

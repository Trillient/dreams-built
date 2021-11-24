const mongoose = require('mongoose');

const timeSheetEntrySchema = mongoose.Schema(
  {
    entryId: { type: String, required: true, unique: true },
    day: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    jobNumber: { type: Number, required: true },
    updated: String,
    jobTime: { type: Number, required: true },
  },
  { timestamps: true }
);

const timeSheetSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    userId: { type: String, required: true },
    weekStart: { type: String, required: true },
    weekEnd: { type: String, required: true },
    entries: [timeSheetEntrySchema],
  },
  { timestamps: true }
);

const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);

module.exports = TimeSheet;

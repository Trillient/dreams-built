const mongoose = require('mongoose');

const timeSheetEntry = mongoose.Schema(
  {
    entryId: { type: String, required: true, unique: true },
    day: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, require: true },
    jobNumber: {
      type: Number,
      required: true,
    },
    updated: String,
    jobTime: { type: Number, require: true },
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
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    entries: [timeSheetEntry],
  },
  { timestamps: true }
);

const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);

module.exports = TimeSheet;

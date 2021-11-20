import mongoose from 'mongoose';

const timeSheetEntry = mongoose.Schema(
  {
    entryId: { type: String, required: true, unique: true },
    day: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, require: true },
    jobNumber: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'JobSchema',
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
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    entries: [timeSheetEntry],
  },
  { timestamps: true }
);

const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);

export default TimeSheet;

import mongoose from 'mongoose';

const timeSheetSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    entries: [
      {
        entryId: { type: String, required: true },
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
    ],
  },
  { timestamps: true }
);

const timeSheet = mongoose.model('timeSheet', timeSheetSchema);

export default timeSheet;

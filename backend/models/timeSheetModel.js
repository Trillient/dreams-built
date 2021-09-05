import mongoose from "mongoose";

const timeSheetSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  weekStart: Date,
  WeekEnd: Date,
  timeSheet: [
    {
      date: Date,
      entries: [
        {
          startTime: Number,
          endTime: Number,
          jobNumber: Number,
          totalTime: Number,
        },
      ],
    },
  ],
});

const timeSheet = mongoose.model("timeSheet", timeSheetSchema);

export default timeSheet;

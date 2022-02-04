const mongoose = require('mongoose');

const timesheetCommentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    day: { type: String, required: true },
    weekStart: { type: String, required: true },
    comments: { type: String },
  },
  { timestamps: true }
);

const TimesheetComment = mongoose.model('TimesheetComment', timesheetCommentSchema);

module.exports = TimesheetComment;

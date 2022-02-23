const asyncHandler = require('express-async-handler');
const TimesheetComment = require('../models/timesheetCommentModel');
const TimesheetEntry = require('../models/timesheetEntryModel');
const User = require('../models/userModel');

/**
 * @Desc Get a user's timesheet entries
 * @Route GET /api/timesheet/user/:id
 * @Access Private ("read:timesheet", employee, admin)
 */

const getUserEntries = asyncHandler(async (req, res) => {
  const weekStart = req.query.weekstart;
  const userId = req.params.id;

  const user = await User.findOne({ userId: userId });

  if (user) {
    const entries = await TimesheetEntry.find({ weekStart: weekStart, userId: userId }).populate('job');
    const comments = await TimesheetComment.find({ weekStart: weekStart, user: user._id });

    res.json({ weekStart: weekStart, entries: entries, comments: comments });
  } else {
    res.status(404);
    throw new Error('User does not exist');
  }
});

/**
 * @Desc Create a user timesheet entry
 * @Route POST /api/timesheet/user/:id
 * @Access Private ("create:timesheet", employee, admin)
 */

const createUserEntry = asyncHandler(async (req, res) => {
  const { weekStart, weekEnd, entries, comments } = req.body;

  const user = await User.findOne({ userId: req.params.id });

  if (!user) {
    res.status(404);
    throw new Error('Invalid user');
  }
  await TimesheetComment.deleteMany({ weekStart: weekStart, user: user._id });
  await TimesheetEntry.deleteMany({ weekStart: weekStart, userId: req.params.id });

  const commentsResult = await comments.map((comment) => {
    TimesheetComment.create({
      user: user._id,
      day: comment.day,
      weekStart: weekStart,
      comments: comment.comments,
    });
  });

  const entriesResult = await entries.map((entry) => {
    TimesheetEntry.create({
      user: user._id,
      job: entry.job._id,
      userId: req.params.id,
      entryId: entry.entryId,
      day: entry.day,
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      jobNumber: entry.job.jobNumber,
      jobTime: entry.jobTime,
      weekStart: weekStart,
      weekEnd: weekEnd,
    });
  });

  res.status(201).json({ entriesCreated: entriesResult.length, commentsCreated: commentsResult.length });
});

/**
 * @Desc Get all users timesheet entries for week
 * @Route GET /api/timesheet/admin
 * @Access Private - ("admin_read:timesheet", Admin)
 */

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await TimesheetEntry.find({ weekStart: req.query.weekstart }).populate('user job', 'firstName lastName auth0Email hourlyRate userId jobNumber address city');

  res.json(result);
});

/**
 * @Desc Update a timesheet entry for a user
 * @Route PATCH /api/timesheet/admin/users/entry/:id
 * @Access Private - ("admin_update:timesheet", Admin)
 */
//TODO - update to handle job model addition
const updateAUsersEntry = asyncHandler(async (req, res) => {
  const { startTime, endTime, jobNumber, jobTime } = req.body;

  const entry = await TimesheetEntry.findById(req.params.id);

  if (entry) {
    entry.startTime = startTime;
    entry.endTime = endTime;
    entry.jobNumber = jobNumber;
    entry.jobTime = jobTime;
    entry.save();
    res.json(entry);
  } else {
    res.status(404);
    throw new Error('Entry not found');
  }
});
/**
 * @Desc Delete a timesheet entry for a user
 * @Route DELETE /api/timesheet/admin/users/entry/:id
 * @Access Private - ("admin_delete:timesheet", Admin)
 */

const deleteAUsersEntry = asyncHandler(async (req, res) => {
  const entry = await TimesheetEntry.findById(req.params.id);

  if (entry) {
    entry.remove();
    res.json({ message: 'Entry Deleted' });
  } else {
    res.status(404);
    throw new Error('Entry not found');
  }
});

module.exports = { getUserEntries, createUserEntry, getAllUsers, updateAUsersEntry, deleteAUsersEntry };

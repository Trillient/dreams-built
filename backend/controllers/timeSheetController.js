const asyncHandler = require('express-async-handler');
const TimeSheetEntry = require('../models/TimeSheetEntryModel');
const User = require('../models/userModel');

/**
 * @Desc Create a user timesheet entry
 * @Route POST /api/timesheet/user/:id
 * @Access Private
 */

const getUserEntries = asyncHandler(async (req, res) => {
  const user = await User.findOne({ userId: req.params.id });

  const weekStart = req.query.weekstart;

  const entries = await TimeSheetEntry.find({ weekStart: weekStart, userId: req.params.id, isArchive: false });

  res.json({ weekStart: weekStart, entries: entries });
});

/**
 * @Desc Create a user timesheet entry
 * @Route POST /api/timesheet/user
 * @Access Private
 */

const createUserEntry = asyncHandler(async (req, res) => {
  const { weekStart, weekEnd, entries } = req.body;

  const user = await User.findOne({ userId: req.params.id });

  if (user.userId !== req.params.id) {
    res.status(401);
    throw new Error('Invalid user credentials');
  }

  // TODO - Run validation on parameters
  const archive = await TimeSheetEntry.find({ weekStart: weekStart, userId: req.params.id, isArchive: false });

  const totalEntriesArchieved = await TimeSheetEntry.find({ weekStart: weekStart, userId: req.params.id, isArchive: true });

  await TimeSheetEntry.updateMany({ weekStart: weekStart, userId: req.params.id }, { $set: { isArchive: true } });

  const data = await entries.map((entry) => {
    TimeSheetEntry.create({
      user: user._id,
      userId: req.params.id,
      entryId: entry.entryId,
      day: entry.day,
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      jobNumber: entry.jobNumber,
      jobTime: entry.jobTime,
      weekStart: weekStart,
      weekEnd: weekEnd,
    });
  });

  res.status(201).json({ entriesCreated: data.length, entriesArchived: archive.length, totalArchived: totalEntriesArchieved.length + archive.length });
});

/**
 * @Desc Get all users timesheet entries for week
 * @Route GET /api/timesheet/admin
 * @Access Private - Admin
 */

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await TimeSheetEntry.find({ weekStart: req.query.weekstart, isArchive: false }).populate('user', 'firstName lastName hourlyRate');

  res.json(result);
});

/**
 * @Desc Delete user archive timesheet entries
 * @Route POST /api/timesheet/admin/archive
 * @Access Private - Admin
 */

const deleteArchive = asyncHandler(async (req, res) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);

  const fields = { isArchive: true, updatedAt: { $lt: cutoff } };
  const entries = await TimeSheetEntry.find(fields);

  await TimeSheetEntry.deleteMany(fields);

  res.json({ cutOffDate: cutoff, deletedEntries: entries.length });
});

module.exports = { getUserEntries, createUserEntry, getAllUsers, deleteArchive };

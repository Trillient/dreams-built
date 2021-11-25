const asyncHandler = require('express-async-handler');
const TimeSheetEntry = require('../models/TimeSheetEntryModel');
const User = require('../models/userModel');

/**
 * @Desc Create a user timesheet entry
 * @Route POST /api/timesheet/user/:id
 * @Access Private
 */

const getUserEntries = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const { weekStart } = req.query.weekstart;
  if (user.userId !== req.user.azp) {
    res.status(401);
    throw new Error('Invalid user credentials');
  }
  const entries = await TimeSheetEntry.find({ weekStart: weekStart, user: req.params.id, userId: req.user.azp });

  res.json(entries);
});

/**
 * @Desc Create a user timesheet entry
 * @Route POST /api/timesheet/user/:id
 * @Access Private
 */

const createUserEntry = asyncHandler(async (req, res) => {
  const { weekStart, weekEnd, entries } = req.body;

  const user = await User.findById(req.params.id);

  if (user.userId !== req.user.azp) {
    res.status(401);
    throw new Error('Invalid user credentials');
  }

  // TODO - Run validation on parameters
  const archive = await TimeSheetEntry.find({ weekStart: weekStart, user: req.params.id, userId: req.user.azp, isArchive: false });
  const totalEntriesArchieved = await TimeSheetEntry.find({ weekStart: weekStart, user: req.params.id, userId: req.user.azp, isArchive: true });
  await TimeSheetEntry.updateMany({ weekStart: weekStart, user: req.params.id, userId: req.user.azp }, { $set: { isArchive: true } });

  const date = Date(weekStart).weekNumber;

  console.log(date);

  const data = await entries.map((entry) => {
    TimeSheetEntry.create({
      user: req.params.id,
      userId: req.user.azp,
      entryId: entry.entryId,
      day: entry.day,
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      jobNumber: entry.jobNumber,
      jobTime: entry.jobTime,
      weekStart: weekStart,
      weekEnd: weekEnd,
      weekNumber: Date(weekStart).weekNumber,
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
  const result = await TimeSheetEntry.find({ weekStart: req.query.weekstart }).populate('user', 'firstName lastName hourlyRate');

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

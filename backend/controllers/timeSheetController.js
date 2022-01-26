const asyncHandler = require('express-async-handler');
const TimesheetEntry = require('../models/timesheetEntryModel');
const User = require('../models/userModel');

/**
 * @Desc Get a user's timesheet entries
 * @Route GET /api/timesheet/user/:id
 * @Access Private
 */

const getUserEntries = asyncHandler(async (req, res) => {
  const weekStart = req.query.weekstart;
  const user = req.params.id;

  const userExists = await User.findOne({ userId: user });

  if (userExists) {
    const entries = await TimesheetEntry.find({ weekStart: weekStart, userId: user, isArchive: false });

    res.json({ weekStart: weekStart, entries: entries });
  } else {
    res.status(404);
    throw new Error('User does not exist');
  }
});

/**
 * @Desc Create a user timesheet entry
 * @Route POST /api/timesheet/user/:id
 * @Access Private
 */

const createUserEntry = asyncHandler(async (req, res) => {
  const { weekStart, weekEnd, entries } = req.body;

  const user = await User.findOne({ userId: req.params.id });

  if (!user) {
    res.status(404);
    throw new Error('Invalid user');
  }

  const archive = await TimesheetEntry.find({ weekStart: weekStart, userId: req.params.id, isArchive: false });

  const totalEntriesArchieved = await TimesheetEntry.find({ weekStart: weekStart, userId: req.params.id, isArchive: true });

  await TimesheetEntry.updateMany({ weekStart: weekStart, userId: req.params.id }, { $set: { isArchive: true } });

  const data = await entries.map((entry) => {
    TimesheetEntry.create({
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
  const result = await TimesheetEntry.find({ weekStart: req.query.weekstart, isArchive: false }).populate('user', 'firstName lastName hourlyRate');

  res.json(result);
});

/**
 * @Desc Create a timesheet entry for a user
 * @Route POST/api/timesheet/admin
 * @Access Private - Admin
 */

const createAUsersEntry = asyncHandler(async (req, res) => {
  res.json({});
});

/**
 * @Desc Update a timesheet entry for a user
 * @Route PATCH /api/timesheet/admin
 * @Access Private - Admin
 */

const updateAUsersEntry = asyncHandler(async (req, res) => {
  res.json({});
});
/**
 * @Desc Delete a timesheet entry for a user
 * @Route DELETE /api/timesheet/admin
 * @Access Private - Admin
 */

const deleteAUsersEntry = asyncHandler(async (req, res) => {
  res.json({});
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
  const entries = await TimesheetEntry.find(fields);

  await TimesheetEntry.deleteMany(fields);

  res.json({ cutOffDate: cutoff, deletedEntries: entries.length });
});

module.exports = { getUserEntries, createUserEntry, getAllUsers, createAUsersEntry, updateAUsersEntry, deleteAUsersEntry, deleteArchive };

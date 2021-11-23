const asyncHandler = require('express-async-handler');
const TimeSheet = require('../models/timeSheetModel');

/**
 * @Desc Create a user timesheet entry
 * @Route POST /api/timesheet/user/:id
 * @Access Private
 */

const createUserEntry = asyncHandler(async (req, res) => {
  const { weekStart, weekEnd, entries } = req.body;

  console.log(req.user);
  const timeSheetEntry = new TimeSheet({
    user: req.params._id,
    userId: req.token.userId,
    weekStart: weekStart,
    weekEnd: weekEnd,
    entries: entries,
  });

  const createdEntry = await timeSheetEntry.save();

  res.status(201).json(createdEntry);
});

module.exports = { createUserEntry };

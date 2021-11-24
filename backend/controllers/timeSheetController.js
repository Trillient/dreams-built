const asyncHandler = require('express-async-handler');
const TimeSheet = require('../models/timeSheetModel');
const User = require('../models/userModel');

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

  const timeSheetEntry = new TimeSheet({
    user: req.params.id,
    userId: req.user.azp,
    weekStart: weekStart,
    weekEnd: weekEnd,
    entries: entries,
  });

  const createdEntry = await timeSheetEntry.save();

  res.status(201).json(createdEntry);
});

module.exports = { createUserEntry };

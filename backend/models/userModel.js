const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    birthDate: Date,
    hourlyRate: Number,
    startDate: Date,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

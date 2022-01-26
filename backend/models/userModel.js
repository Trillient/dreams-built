const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    auth0Email: { type: String },
    hourlyRate: Number,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

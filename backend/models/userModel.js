const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    auth0Email: { type: String, required: true },
    hourlyRate: { type: Number },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

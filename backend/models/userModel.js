const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, default: 'John' },
    lastName: { type: String, default: 'Doe' },
    auth0Email: { type: String },
    hourlyRate: { type: Number, default: 21 },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

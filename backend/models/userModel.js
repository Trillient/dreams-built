const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: [isEmail, 'invalid email'] },
    phoneNumber: Number || String,
    isAdmin: { type: Boolean, required: true, default: false },
    birthDate: Date,
    hourlyRate: Number,
    startDate: Date,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

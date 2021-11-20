const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: [isEmail, 'invalid email'] },
    isAdmin: { type: Boolean, required: true, default: false },
    userDetails: {
      birthDate: Date,
      hourlyRate: Number,
      startDate: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

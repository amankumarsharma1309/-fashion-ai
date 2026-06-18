const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  otp: {
    type: Number,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model(
  "PendingUser",
  pendingUserSchema
);
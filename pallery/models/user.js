const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "user name must be provided"] },
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, "Please fill a valid email address"],
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user"],
      message: "{VALUE} is not valid",
    },
    default: "user",
    required: true,
  },
  albumIds: { type: [String], default: [] },
  paintingIds: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("User", userSchema);

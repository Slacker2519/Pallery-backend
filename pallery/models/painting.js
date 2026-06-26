const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema({
  name: { type: String, required: [true, "painting name must be provided"] },
  source: { type: String },
  tags: { type: [String], default: [] },
  url: { type: String, required: [true, "painting url must be provided"] },
  author: { type: String },
  authorUrl: { type: String },
  ownerId: {
    type: String,
    required: [true, "painting owner id must be provided"],
  },
  visibility: {
    type: String,
    enum: {
      values: ["public", "private"],
      message: "{VALUE} is not supported",
    },
    default: "public",
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Painting", paintingSchema);

const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "album name must be provided"],
    maxlength: 50,
  },
  ownerId: {
    type: String,
    required: [true, "owner id must be provided"],
  },
  paintingIds: { type: [String], default: [] },
  coverPaintingId: { type: String, default: null },
  description: {
    type: String,
    default: "",
    maxlength: 300,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
}, { timestamps: true });

module.exports = mongoose.model("Album", albumSchema);

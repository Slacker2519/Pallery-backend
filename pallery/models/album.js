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
  paintingsId: { type: [String], default: [] },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
});

module.exports = mongoose.model("Album", albumSchema);

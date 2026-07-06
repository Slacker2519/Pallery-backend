const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "album name must be provided"],
    maxlength: 50,
  },
  paintingsId: { type: [String], default: [] },
  ownerId: {
    type: String,
    required: [true, "owner id must be provided"],
  },
});

module.exports = mongoose.model("Album", albumSchema);

const mongoose = require("mongoose");

const vlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    videoUrl: {
      type: String,
      required: true
    },

    thumbnail: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Vlog", vlogSchema);
const mongoose = require("mongoose");

const recordingSchema =
  new mongoose.Schema({

    caller: {
      type: String
    },

    receiver: {
      type: String
    },

    recordingUrl: {
      type: String
    }

  });

module.exports =
  mongoose.model(
    "Recording",
    recordingSchema
  );
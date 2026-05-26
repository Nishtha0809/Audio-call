const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
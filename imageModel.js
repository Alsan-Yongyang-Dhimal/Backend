const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const imageModel = new mongoose.model("imagedata", imageSchema);
module.exports = imageModel;

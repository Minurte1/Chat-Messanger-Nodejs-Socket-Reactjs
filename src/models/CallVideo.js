const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  username_video: { type: String, required: true, unique: true },
  idVideoMe: { type: String, required: true },
});

module.exports = mongoose.model("IdVideo", VideoSchema);

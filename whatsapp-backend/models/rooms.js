const mongoose = require("mongoose");
const roomsSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("Rooms", roomsSchema);

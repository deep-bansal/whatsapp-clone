const mongoose = require("mongoose");

const whatsappSchema = new mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: String,
  roomId: String,
});

module.exports = mongoose.model("messagecontents", whatsappSchema);

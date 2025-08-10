const mongoose = require("mongoose");

const LoginDataSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  platform: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LoginData", LoginDataSchema);

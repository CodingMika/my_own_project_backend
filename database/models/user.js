const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  city: String,
  phone_number: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);

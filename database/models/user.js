const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  image: String,
  name: String,
  city: String,
  phoneNumber: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);

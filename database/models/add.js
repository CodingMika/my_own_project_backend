const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addSchema = new Schema({
  userId: String,
  image: String,
  title: String,
  city: String,
  description: String,
});

module.exports = mongoose.model("Add", addSchema);

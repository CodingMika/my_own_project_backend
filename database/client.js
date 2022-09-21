const mongoose = require("mongoose");

module.exports = class DB {
  static client;
  static async init() {
    const mongoDB =
      "mongodb+srv://Ekaterina:1752@cluster0.g2p03.mongodb.net/my_own_project_db?retryWrites=true&w=majority";
    this.client = await mongoose.connect(mongoDB);
    console.log("You are connected to MongoDB.");
  }
};

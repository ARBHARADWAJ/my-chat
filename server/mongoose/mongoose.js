// mongooseInstance.js
const mongoose = require("mongoose");

const mongoDBUri =
  "mongodb+srv://user_2023_ar:BZLERIJrd2sSoAP5@cluster0.vn4zl3w.mongodb.net/Cyclone?retryWrites=true&w=majority";

//or user message

mongoose.connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = mongoose;

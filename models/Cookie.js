const mongoose = require("mongoose");

const cookieSchema = new mongoose.Schema({
  email: String,
  cookie: String,
  expires: Date,
});

module.exports = cookieSchema;

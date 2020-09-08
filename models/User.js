const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  years: Number,
  city: String,
  password: String,
  email: String,
  isPro: { type: Boolean, default: false },
  dateOfsub: { type: Date, default: Date.now() },
});

module.exports = userSchema;

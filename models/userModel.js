const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const userSchema = new Schema({
  username: { required: true, type: String },
  email: { required: true, type: String },
  password: { required: true, type: String },
  admin: { type: Boolean, default: false },
  avatar: {
    type: String,
    required: true,
    enum: ["none"],
    default: "none",
  },
  date: { default: Date.now(), type: Date },
});

userSchema.virtual("date_formatted").get(function () {
  return this.date
    ? DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED)
    : "";
});

const User = mongoose.model("User", userSchema);

module.exports = User;

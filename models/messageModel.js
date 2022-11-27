const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, maxLength: 500 },
  date: { default: Date.now(), type: Date },
});

MessageSchema.virtual("date_formatted").get(function () {
  return this.date
    ? DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED)
    : "";
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;

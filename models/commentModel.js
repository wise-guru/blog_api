const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema({
  // user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "guest" },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String, required: true, maxLength: 500 },
  date: { default: Date.now(), type: Date },
});

CommentSchema.virtual("date_formatted").get(function () {
  return this.date
    ? DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED)
    : "";
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

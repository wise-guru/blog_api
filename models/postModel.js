const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, minLength: 1, maxLength: 50 },
  image: { type: String, data: Buffer, default: "nomad.jpg", required: false },
  text: { type: String, required: true, maxLength: 1000 },
  date: { default: Date.now(), type: Date },
  // comments: { type: Schema.Types.ObjectId },
});

PostSchema.virtual("date_formatted").get(function () {
  return this.date
    ? DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED)
    : "";
});

PostSchema.virtual("month_and_day").get(function () {
  return this.date ? `${this.date.getMonth()} ${this.date.getDate()}` : "";
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

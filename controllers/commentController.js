const { body, validationResult, Result } = require("express-validator");
const { default: mongoose } = require("mongoose");
const Comment = require("../models/commentModel");

exports.get_all_comments = async (req, res, next) => {
  try {
    const comments = await Comment.find().sort([["date", "descending"]]);
    return res.send(comments);
  } catch (err) {
    return next(err);
  }
};

exports.get_specific_comment = function (req, res, next) {
  Comment.findById(req.params.commentId)
    // .populate("comment")
    .exec(function (err, comment) {
      if (err) {
        return next(err);
      }
      if (comment == null) {
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }
      res.send(comment);
    });
};

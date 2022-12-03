// const Message = require("../models/message");
const { body, validationResult, Result } = require("express-validator");
const { default: mongoose } = require("mongoose");
const Comment = require("../models/commentModel");

// exports.create_get_message = (req, res, next) => {
//   if (!res.locals.currentUser) {
//     // Users not logged in cannot access "create a message page"
//     return res.redirect("/log-in");
//   }
//   res.render("create_message", {
//     title: "Create a Message",
//     user: res.locals.currentUser,
//   });
// };

exports.get_all_comments = async (req, res, next) => {
  try {
    const comments = await Comment.find().sort([["date", "descending"]]);
    return res.send(comments);
  } catch (err) {
    return next(err);
  }
};

exports.get_specific_comment = function (req, res, next) {
  // try {
  // const post = await Post.find
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
  // }
};

// exports.create_message_post = [
//   body("messageTitle")
//     .trim()
//     .isLength({ min: 1 })
//     .withMessage("Title must not be empty"),
//   body("messageText")
//     .trim()
//     .isLength({ min: 1 })
//     .withMessage("Text must not be empty"),

//   async (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       res.render("create_message", {
//         title: "Create a Message",
//         errors: errors.array(),
//       });
//     }

//     const message = new Message({
//       user: req.user._id,
//       title: req.body.messageTitle,
//       text: req.body.messageText,
//       date: Date.now(),
//     });

//     await message.save((err) => {
//       if (err) return next(err);
//       res.redirect("/");
//     });
//   },
// ];

// exports.delete_message_post = (req, res, next) => {
//   // Remove the message using the id from the database
//   Message.findByIdAndRemove(req.body.messageId, function deleteMessage(err) {
//     if (err) return next(err);
//     res.redirect("back");
//   });
// };

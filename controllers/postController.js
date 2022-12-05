const {
  body: check,
  checkSchema,
  validationResult,
} = require("express-validator");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const multer = require("multer");
const fs = require("fs");
const async = require("async");
const { default: mongoose } = require("mongoose");

//To store images

const Storage = multer.diskStorage({
  destination: "public/images/posts",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: Storage,
  fileFilter(req, file, callback) {
    checkImageErrors(req, file, callback);
  },
});

exports.get_all_posts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort([["date", "descending"]])
      .populate("user");
    return res.send(posts);
  } catch (err) {
    return next(err);
  }
};

exports.get_specific_post = function (req, res, next) {
  Post.findById(req.params.postId)
    // .populate("comment")
    .populate("user")
    .exec(function (err, post) {
      if (err) {
        return next(err);
      }
      if (post == null) {
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }
      res.send(post);
    });
};

exports.get_post_comments = async (req, res, next) => {
  try {
    const postComments = await Comment.find({ post: req.params.postId }).sort([
      ["date", "descending"],
    ]);

    return res.send(postComments);
  } catch (err) {
    return next(err);
  }
};

exports.get_image = function (req, res, next) {
  Post.findById(req.params.postId)
    // .populate("comment")
    .populate("user")
    .exec(function (err, post) {
      if (err) {
        return next(err);
      }
      if (post == null) {
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }
      res.send(`/images/posts/${post.image}`);
    });
};

exports.create_post_comment = [
  async (req, res, next) => {
    const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   res.render("create_message", {
    //     title: "Create a Message",
    //     errors: errors.array(),
    //   });
    // }

    const comment = new Comment({
      name: req.body.name,
      post: req.body.post,
      text: req.body.text,
      date: req.body.date,
    });

    comment.save((err, result) => {
      if (err) {
        console.log(err);
        return res.json({ error: err });
      }
      console.log("sucess");
      return res.json({ comment: result, msg: "Post Success" });
    });
  },
];

exports.create_post = [
  upload.single("image"),
  check("postTitle")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must not be empty"),
  check("postText")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Text must not be empty"),
  checkSchema({
    image: {
      custom: {
        options: (value, { req, location, path }) => {
          return !!req.file;
        },
        errorMessage:
          "You need to upload a product image in format .jpg, .jpeg, .png, or .webp. File size should be less than 5MB",
      },
    },
  }),

  (req, res, next) => {
    const errors = validationResult(req);

    // Create a Post object with escaped and trimmed data.
    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      image: undefined === req.file ? "" : req.file.filename,
      date: new Date(),
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      if (!!req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.log(err.message);
        });
      }

      (err, results) => {
        if (err) {
          return next(err);
        }

        res.send("game_form", {
          // title: "Create Game",
          results,
          errors: errors.array(),
        });
      };
      return;
    }

    // Data from form is valid. Save poat.
    post.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new post record.
      res.redirect(post.url);
    });
  },
];

const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.get_signup = (req, res, next) => {
  res.render("sign-up", { title: "Sign Up" });
};

exports.post_signup = [
  body("username")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Username must be at least 6 characters."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password must be at least 6 characters."),
  body("confirmPassword")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password must be at least 6 characters")
    .custom(async (value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords must be the same");
      return true;
    }),

  async (req, res, next) => {
    const isUserTaken = await User.find({ username: req.body.username });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("ERROR!");
      return res.render("sign-up", {
        title: "Sign Up",
        errors: errors.array(),
        success: [],
        passwordConfirmationError: "Passwords must be the same",
      });
    }

    try {
      if (isUserTaken.length > 0)
        return res.render("sign-up", {
          title: "Sign Up",
          error: "User already exists",
        });
      //If username does not exist, continue to register new user to db
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          admin: false,
          avatar: req.body.avatar,
          date: Date.now(),
        }).save((err) => (err ? next(err) : res.redirect("/")));
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_login = (req, res) => {
  // If user is already logged in, redirect them to the homepage
  if (res.locals.currentUser) return res.redirect("/");
  res.render("log-in", { title: "Login", error: req.flash("error") });
};

exports.post_login = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Enter a username")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Enter a password")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login", {
        username: req.body.username,
        errors: errors.array(),
      });
    }
    next();
  },

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
  }),
];

exports.get_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//--------- Blog Post Routes ---------//

router.get("/posts", postController.get_all_posts);

router.get("/posts/:postId", postController.get_specific_post);

router.get("/posts/:postId/comments", postController.get_post_comments);

router.post("/comments", postController.create_post_comment);

router.get("/posts/:postId/:image", postController.get_image);

//--- Comments Routes ------//

router.get("/comments", commentController.get_all_comments);

router.get("/comments/:commentId", commentController.get_specific_comment);

// router.post("/comments/:")

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const feedController = require("../controllers/feed");

router.get("/posts", isAuth, feedController.getPosts);
router.post(
  "/posts",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.addPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.editPost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

router.get('/status', isAuth, feedController.getStatus);
router.put('/edit/status', isAuth, feedController.editStatus)

module.exports = router;

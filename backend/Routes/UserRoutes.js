const express = require("express");
const router = express.Router();

const {
  UserProfile,
  UserMedia,
  UserReels,
  PostComment,
  ReplyComment,
} = require("../Controller/User");

router.get("/user/:userId", UserProfile);
router.get("/feed/:userId", UserMedia);
router.get("/reels/:userId", UserReels);
router.post("/comment/:mediaId", PostComment);
router.post("/comment/:commentId/reply", ReplyComment);

module.exports = router;

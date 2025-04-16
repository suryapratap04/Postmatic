const { Router } = require("express");

const {
  UserProfile,
  UserMedia,
  UserReels,
  PostComment,
  ReplyComment,
} = require("../Controller/User");

Router.get("/user/:userId", UserProfile);
Router.get("/feed/:userId", UserMedia);
Router.get("/reels/:userId", UserReels);
Router.post("/comment/:mediaId", PostComment);
Router.post("/comment/:commentId/reply", ReplyComment);

module.exports = Router;

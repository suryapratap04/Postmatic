const express = require("express");
const router = express.Router();

const { AuthCallback } = require("../Controller/Auth");

router.get("/callback", AuthCallback);

module.exports = router;

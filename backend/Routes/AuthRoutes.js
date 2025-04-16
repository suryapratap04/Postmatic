const { Router } = require("express");

const { AuthCallback } = require("../Controller/Auth");

Router.get("/callback", AuthCallback);

module.exports = Router;

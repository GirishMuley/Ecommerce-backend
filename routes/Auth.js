const express = require("express");
const {
  createUser,
  loginUser,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
} = require("../controller/Auth");
const passport = require("passport");

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .post("/reset-password-request", resetPasswordRequest)
  .post("/reset-password", resetPassword);

exports.router = router;

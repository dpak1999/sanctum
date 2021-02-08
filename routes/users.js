/** @format */

const express = require("express");
const router = express.Router();
const User = require("../models/users");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to sanctum");
      res.redirect("/heritages");
    } catch (e) {
      req.flash("error", "Uh Oh! such an user already exists");
      res.redirect("/register");
    }
  })
);

module.exports = router;

/** @format */

const express = require("express");
const passport = require("passport");
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
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to sanctum");
        res.redirect("/heritages");
      });
    } catch (e) {
      req.flash("error", "Uh Oh! such an user already exists");
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back");
    res.redirect("/heritages");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Good bye");
  res.redirect("/heritages");
});

module.exports = router;

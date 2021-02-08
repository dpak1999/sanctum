/** @format */

const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  res.send(req.body);
});

module.exports = router;

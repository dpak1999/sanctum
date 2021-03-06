/** @format */

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Heritage = require("../models/heritage");
const { isLoggedIn, isAuthor, validateSite } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const sites = await Heritage.find({});
    res.render("sites/index", { sites });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("sites/new");
});

router.post(
  "/",
  isLoggedIn,
  validateSite,
  catchAsync(async (req, res, next) => {
    const site = new Heritage(req.body.heritage);
    site.author = req.user._id;
    await site.save();
    req.flash("success", "Heritage site added successfully");
    res.redirect(`/heritages/${site._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const site = await Heritage.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    if (!site) {
      req.flash("error", "No campground with that name found");
      return res.redirect("/heritages");
    }
    res.render("sites/show", { site });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const site = await Heritage.findById(id);
    if (!site) {
      req.flash("error", "No campground with that name found");
      return res.redirect("/heritages");
    }
    res.render("sites/edit", { site });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateSite,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const site = await Heritage.findByIdAndUpdate(id, { ...req.body.heritage });
    req.flash("success", "Heritage site updated successfully");
    res.redirect(`/heritages/${site._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Heritage.findByIdAndDelete(id);
    req.flash("error", "Heritage site deleted successfully");
    res.redirect(`/heritages`);
  })
);

module.exports = router;

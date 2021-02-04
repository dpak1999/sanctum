/** @format */

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Heritage = require("../models/heritage");
const { heritageSchema } = require("../joiSchemas");

const validateSite = (req, res, next) => {
  const { error } = heritageSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const sites = await Heritage.find({});
    res.render("sites/index", { sites });
  })
);

router.get("/new", (req, res) => {
  res.render("sites/new");
});

router.post(
  "/",
  validateSite,
  catchAsync(async (req, res, next) => {
    const site = new Heritage(req.body.heritage);
    await site.save();
    req.flash("success", "Heritage site added successfully");
    res.redirect(`/heritages/${site._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const site = await Heritage.findById(req.params.id).populate("reviews");
    if (!site) {
      req.flash("error", "No campground with that name found");
      return res.redirect("/heritages");
    }
    res.render("sites/show", { site });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const site = await Heritage.findById(req.params.id);
    if (!site) {
      req.flash("error", "No campground with that name found");
      return res.redirect("/heritages");
    }
    res.render("sites/edit", { site });
  })
);

router.put(
  "/:id",
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
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Heritage.findByIdAndDelete(id);
    req.flash("error", "Heritage site deleted successfully");
    res.redirect(`/heritages`);
  })
);

module.exports = router;

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
    res.redirect(`/heritages/${site._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const site = await Heritage.findById(req.params.id).populate("reviews");
    res.render("sites/show", { site });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const site = await Heritage.findById(req.params.id);
    res.render("sites/edit", { site });
  })
);

router.put(
  "/:id",
  validateSite,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const site = await Heritage.findByIdAndUpdate(id, { ...req.body.heritage });
    res.redirect(`/heritages/${site._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Heritage.findByIdAndDelete(id);
    res.redirect(`/heritages`);
  })
);

module.exports = router;

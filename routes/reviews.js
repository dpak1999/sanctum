/** @format */
const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Heritage = require("../models/heritage");
const Review = require("../models/review");
const { reviewSchema } = require("../joiSchemas");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const heritage = await Heritage.findById(req.params.id);
    const review = new Review(req.body.review);
    heritage.reviews.push(review);
    await review.save();
    await heritage.save();
    res.redirect(`/heritages/${heritage._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Heritage.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/heritages/${id}`);
  })
);

module.exports = router;

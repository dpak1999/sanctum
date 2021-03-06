/** @format */
const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Heritage = require("../models/heritage");
const Review = require("../models/review");
const { validateReview } = require("../middleware");

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const heritage = await Heritage.findById(req.params.id);
    const review = new Review(req.body.review);
    heritage.reviews.push(review);
    await review.save();
    await heritage.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/heritages/${heritage._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Heritage.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("error", "Review deleted successfully");
    res.redirect(`/heritages/${id}`);
  })
);

module.exports = router;

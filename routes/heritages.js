/** @format */

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateSite } = require("../middleware");
const heritages = require("../controllers/heritages");

router.get("/", catchAsync(heritages.index));

router.get("/new", isLoggedIn, heritages.renderNewForm);

router.post("/", isLoggedIn, validateSite, catchAsync(heritages.createNewSite));

router.get("/:id", catchAsync(heritages.showSite));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(heritages.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateSite,
  catchAsync(heritages.updateSite)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(heritages.deleteSite));

module.exports = router;

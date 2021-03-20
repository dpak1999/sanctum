/** @format */

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateSite } = require("../middleware");
const heritages = require("../controllers/heritages");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(heritages.index))
  // .post(isLoggedIn, validateSite, catchAsync(heritages.createNewSite));
  .post(upload.single("image"), (req, res) => {
    console.log(req.body, req.file);
    res.send("It worked");
  });

router.get("/new", isLoggedIn, heritages.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(heritages.showSite))
  .put(isLoggedIn, isAuthor, validateSite, catchAsync(heritages.updateSite))
  .delete(isLoggedIn, isAuthor, catchAsync(heritages.deleteSite));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(heritages.renderEditForm)
);

module.exports = router;

/** @format */

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Heritage = require("./models/heritage");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { heritageSchema } = require("./joiSchemas");

mongoose.connect("mongodb://localhost:27017/sanctum", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Db connected");
});
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateSite = (req, res, next) => {
  const { error } = heritageSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/heritages",
  catchAsync(async (req, res) => {
    const sites = await Heritage.find({});
    res.render("sites/index", { sites });
  })
);

app.get("/heritages/new", (req, res) => {
  res.render("sites/new");
});

app.post(
  "/heritages",
  validateSite,
  catchAsync(async (req, res, next) => {
    const site = new Heritage(req.body.heritage);
    await site.save();
    res.redirect(`/heritages/${site._id}`);
  })
);

app.get(
  "/heritages/:id",
  catchAsync(async (req, res) => {
    const site = await Heritage.findById(req.params.id);
    res.render("sites/show", { site });
  })
);

app.get(
  "/heritages/:id/edit",
  catchAsync(async (req, res) => {
    const site = await Heritage.findById(req.params.id);
    res.render("sites/edit", { site });
  })
);

app.put(
  "/heritages/:id",
  validateSite,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const site = await Heritage.findByIdAndUpdate(id, { ...req.body.heritage });
    res.redirect(`/heritages/${site._id}`);
  })
);

app.delete(
  "/heritages/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Heritage.findByIdAndDelete(id);
    res.redirect(`/heritages`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Uh! Oh Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

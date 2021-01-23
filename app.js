/** @format */

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Heritage = require("./models/heritage");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/heritages", async (req, res) => {
  const sites = await Heritage.find({});
  res.render("sites/index", { sites });
});

app.get("/heritages/new", (req, res) => {
  res.render("sites/new");
});

app.post("/heritages", async (req, res) => {
  const site = new Heritage(req.body.heritage);
  await site.save();
  res.redirect(`/heritages/${site._id}`);
});

app.get("/heritages/:id", async (req, res) => {
  const site = await Heritage.findById(req.params.id);
  res.render("sites/show", { site });
});

app.get("/heritages/:id/edit", async (req, res) => {
  const site = await Heritage.findById(req.params.id);
  res.render("sites/edit", { site });
});

app.put("/heritages/:id", async (req, res) => {
  const { id } = req.params;
  const site = await Heritage.findByIdAndUpdate(id, { ...req.body.heritage });
  res.redirect(`/heritages/${site._id}`);
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

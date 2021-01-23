/** @format */

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makesite", async (req, res) => {
  const site = new Heritage({
    title: "My backyard",
    description: "Most beautful heritage site",
    price: "4000",
    location: "Odisha",
  });
  await site.save();
  res.send(site);
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

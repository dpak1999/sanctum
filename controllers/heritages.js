/** @format */

const Heritage = require("../models/heritage");

module.exports.index = async (req, res) => {
  const sites = await Heritage.find({});
  res.render("sites/index", { sites });
};

module.exports.renderNewForm = (req, res) => {
  res.render("sites/new");
};

module.exports.createNewSite = async (req, res, next) => {
  const site = new Heritage(req.body.heritage);
  site.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  site.author = req.user._id;
  await site.save();
  console.log(site.images);
  req.flash("success", "Heritage site added successfully");
  res.redirect(`/heritages/${site._id}`);
};

module.exports.showSite = async (req, res) => {
  const site = await Heritage.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!site) {
    req.flash("error", "No campground with that name found");
    return res.redirect("/heritages");
  }
  res.render("sites/show", { site });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const site = await Heritage.findById(id);
  if (!site) {
    req.flash("error", "No campground with that name found");
    return res.redirect("/heritages");
  }
  res.render("sites/edit", { site });
};

module.exports.updateSite = async (req, res) => {
  const { id } = req.params;
  const site = await Heritage.findByIdAndUpdate(id, { ...req.body.heritage });
  const newImg = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  site.images.push(...newImg);
  await site.save();
  req.flash("success", "Heritage site updated successfully");
  res.redirect(`/heritages/${site._id}`);
};

module.exports.deleteSite = async (req, res, next) => {
  const { id } = req.params;
  await Heritage.findByIdAndDelete(id);
  req.flash("error", "Heritage site deleted successfully");
  res.redirect(`/heritages`);
};

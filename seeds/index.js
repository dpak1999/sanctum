/** @format */

const mongoose = require("mongoose");
const Heritage = require("../models/heritage");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Heritage.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const site = new Heritage({
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Ea ad elit excepteur proident. Esse duis tempor laboris laboris laborum quis exercitation ut laboris amet elit tempor. Proident eiusmod voluptate veniam veniam eiusmod sunt sit Lorem velit duis veniam magna. Lorem veniam excepteur reprehenderit aliquip Lorem ullamco Lorem nisi ipsum aute. Elit exercitation et amet non ad ipsum ullamco exercitation non laborum.Sit excepteur magna duis aute laboris incididunt sint sunt elit. Deserunt dolore velit aliqua aliquip dolor officia esse eiusmod sunt in irure in dolore. Velit sit enim mollit aliquip Lorem nostrud incididunt officia laboris dolor reprehenderit id dolor cillum. Sunt commodo esse elit irure mollit incididunt aliqua. Velit irure anim amet ex in ad. Officia sit commodo fugiat amet cupidatat ullamco consectetur ea incididunt sunt adipisicing culpa.Dolore id cillum enim non id dolore voluptate do et. Dolor voluptate anim elit fugiat nostrud adipisicing proident cillum ea laboris. Ullamco minim do amet tempor consequat mollit laboris et anim velit aliqua exercitation qui officia. Dolor enim occaecat qui nulla pariatur officia voluptate fugiat fugiat amet eiusmod eiusmod sint. Sint elit non Lorem laborum incididunt aliquip eu sint cillum deserunt ut et amet aliqua. Ea aliquip sit magna ea ea mollit amet et ipsum sunt.",
      price,
    });
    await site.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

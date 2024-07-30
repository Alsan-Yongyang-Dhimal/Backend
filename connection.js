const mongoose = require("mongoose");

const connectdb = async () => {
  await mongoose.connect("mongodb://localhost:27017/studentdb");

  console.log("Database is connected...");
};

connectdb();

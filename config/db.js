const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/taskflow";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url, {});

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;

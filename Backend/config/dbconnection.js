let mongoose = require("mongoose");

require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri).catch((err) => {
  console.error("Failed to connect to MongoDB:", err.message);
  process.exit(1);
});

const fi = mongoose.connection;

fi.on('connected', () => {
  console.log("Connected to MongoDB successfully");
});

fi.on('error', (error) => {
  console.error("MongoDB connection error:", error.message);
});

fi.on('disconnected', () => {
  console.log("Disconnected from MongoDB");
});

module.exports = fi;
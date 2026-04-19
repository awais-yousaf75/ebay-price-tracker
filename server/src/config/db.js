const mongoose = require("mongoose");

async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }
  await mongoose.connect(mongoUri);
}

module.exports = { connectDb };

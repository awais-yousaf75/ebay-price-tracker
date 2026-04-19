const mongoose = require("mongoose");

const trackedProductSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    normalizedUrl: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "" },
    image: { type: String, default: "" },
    currentPrice: { type: Number, default: null },
    previousPrice: { type: Number, default: null },
    currency: { type: String, default: "USD" },
    changeDirection: {
      type: String,
      enum: ["higher", "lower", "same", "new", "unknown"],
      default: "unknown",
    },
    active: { type: Boolean, default: true },
    lastCheckedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrackedProduct", trackedProductSchema);

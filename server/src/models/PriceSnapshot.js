const mongoose = require("mongoose");

const priceSnapshotSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrackedProduct",
      required: true,
      index: true,
    },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    checkedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PriceSnapshot", priceSnapshotSchema);

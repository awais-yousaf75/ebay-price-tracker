const express = require("express");
const TrackedProduct = require("../models/TrackedProduct");
const PriceSnapshot = require("../models/PriceSnapshot");
const { addTrackedProduct } = require("../services/trackingService");
const { normalizeUrl } = require("../services/olostepClient");

const router = express.Router();

router.get("/", async (_req, res) => {
  const rows = await TrackedProduct.find().sort({ createdAt: -1 });
  res.json(rows);
});

router.post("/", async (req, res) => {
  try {
    const product = await addTrackedProduct(req.body?.url);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body?.active === "boolean") updates.active = req.body.active;
    if (req.body?.url) {
      updates.url = req.body.url;
      updates.normalizedUrl = normalizeUrl(req.body.url);
    }
    const updated = await TrackedProduct.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const deleted = await TrackedProduct.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  await PriceSnapshot.deleteMany({ productId: deleted._id });
  return res.status(204).send();
});

router.get("/:id/history", async (req, res) => {
  const history = await PriceSnapshot.find({ productId: req.params.id }).sort({ checkedAt: 1 });
  res.json(history);
});

module.exports = router;

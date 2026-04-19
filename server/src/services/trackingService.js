const { z } = require("zod");
const PriceSnapshot = require("../models/PriceSnapshot");
const TrackedProduct = require("../models/TrackedProduct");
const { scrapeEbayProduct, normalizeUrl } = require("./olostepClient");

const productUrlSchema = z
  .string()
  .url()
  .refine((url) => /ebay\./i.test(url), "URL must be an eBay link")
  .refine(
    (url) => /\/itm\//i.test(url),
    "Use a direct eBay product URL (must contain /itm/)"
  );

function classifyChange(previousPrice, currentPrice) {
  if (currentPrice === null || currentPrice === undefined) return "unknown";
  if (previousPrice === null || previousPrice === undefined) return "new";
  if (currentPrice > previousPrice) return "higher";
  if (currentPrice < previousPrice) return "lower";
  return "same";
}

async function addTrackedProduct(url) {
  const parsed = productUrlSchema.safeParse(url);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid URL");
  }
  const normalizedUrl = normalizeUrl(parsed.data);
  const exists = await TrackedProduct.findOne({ normalizedUrl });
  if (exists) return exists;
  return TrackedProduct.create({ url: parsed.data, normalizedUrl });
}

async function trackSingleProduct(product) {
  const scrape = await scrapeEbayProduct(product.url);
  const previousPrice = product.currentPrice;
  const currentPrice = scrape.price;
  product.previousPrice = previousPrice;
  product.currentPrice = currentPrice;
  product.changeDirection = classifyChange(previousPrice, currentPrice);
  product.title = scrape.title || product.title;
  product.image = scrape.image || product.image;
  product.currency = scrape.currency || product.currency || "USD";
  product.lastCheckedAt = new Date();
  await product.save();

  if (typeof currentPrice === "number") {
    await PriceSnapshot.create({
      productId: product._id,
      price: currentPrice,
      currency: product.currency,
      checkedAt: new Date(),
    });
  }
  return product;
}

async function runTrackingNow() {
  const products = await TrackedProduct.find({ active: true }).sort({
    createdAt: -1,
  });
  const results = { total: products.length, success: 0, failed: 0, errors: [] };
  for (const product of products) {
    try {
      await trackSingleProduct(product);
      results.success += 1;
    } catch (error) {
      results.failed += 1;
      results.errors.push({ id: product._id, url: product.url, message: error.message });
    }
  }
  return results;
}

module.exports = {
  addTrackedProduct,
  runTrackingNow,
  trackSingleProduct,
  productUrlSchema,
};

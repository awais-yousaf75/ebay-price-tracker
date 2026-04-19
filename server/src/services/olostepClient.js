const axios = require("axios");
const { olostepApiKey } = require("../config/env");

function normalizeUrl(rawUrl) {
  return String(rawUrl || "").trim().split("?")[0].replace(/\/$/, "");
}

function extractFirstNumber(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === "number") return value;
  const match = String(value).replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function extractCurrencyFromText(value) {
  const text = String(value || "");
  if (text.includes("$") || /\bUSD\b/i.test(text)) return "USD";
  if (text.includes("GBP") || text.includes("£")) return "GBP";
  if (text.includes("EUR") || text.includes("€")) return "EUR";
  return null;
}

function normalizeScrapePayload(payload) {
  const data = payload?.data || payload?.result || payload;
  const title = data?.title || data?.name || "";
  const image = data?.image || data?.image_url || "";
  let currency = data?.currency || "";
  let price =
    extractFirstNumber(data?.price) ||
    extractFirstNumber(data?.current_price) ||
    extractFirstNumber(data?.sale_price) ||
    extractFirstNumber(data?.display_price);

  if (!currency) currency = "USD";
  return { title, image, currency, price };
}

function normalizeFromMarkdownPayload(payload) {
  const markdown =
    payload?.markdown ||
    payload?.data?.markdown ||
    payload?.result?.markdown_content ||
    payload?.result?.markdown ||
    payload?.text ||
    payload?.data?.text ||
    "";
  let title =
    payload?.metadata?.title ||
    payload?.data?.metadata?.title ||
    payload?.title ||
    "";
  if (!title && markdown) {
    title = markdown.split("\n")[0]?.trim() || "";
  }

  // Prefer explicit "US $123.45" style match from listing pages.
  const itemPriceMatch = markdown.match(
    /Item price[\s\S]{0,100}?\b(US|USD)\s*\$?\s*([0-9][0-9,]*(\.[0-9]{1,2})?)/i
  );
  const buyNowMatch = markdown.match(
    /Buy It Now[\s\S]{0,120}?\b(US|USD)\s*\$?\s*([0-9][0-9,]*(\.[0-9]{1,2})?)/i
  );
  const genericUsdMatch = markdown.match(
    /\b(US|USD)\s*\$?\s*([0-9][0-9,]*(\.[0-9]{1,2})?)/i
  );
  const genericDollarMatch = markdown.match(/\$\s*([0-9][0-9,]*(\.[0-9]{1,2})?)/);
  const moneyMatch = itemPriceMatch || buyNowMatch || genericUsdMatch || genericDollarMatch;
  const price = moneyMatch ? extractFirstNumber(moneyMatch[0]) : null;
  const currency = /\b(US|USD)\b/i.test(moneyMatch?.[0] || "") ? "USD" : "USD";
  return { title, image: "", currency, price };
}

async function scrapeEbayProduct(url) {
  if (!olostepApiKey) {
    throw new Error("OLOSTEP_API_KEY is missing in environment variables.");
  }
  const payload = {
    url_to_scrape: url,
    formats: ["markdown"],
    wait_before_scraping: 0,
  };
  const attempts = [
    // Olostep API keys commonly use direct key headers.
    { "X-API-Key": olostepApiKey, "Content-Type": "application/json" },
    { "x-api-key": olostepApiKey, "Content-Type": "application/json" },
    { Authorization: `Bearer ${olostepApiKey}`, "Content-Type": "application/json" },
  ];

  let lastError = null;
  for (const headers of attempts) {
    try {
      const response = await axios.post("https://api.olostep.com/v1/scrapes", payload, {
        headers,
        timeout: 30000,
      });
      const normalized =
        normalizeScrapePayload(response.data) || normalizeFromMarkdownPayload(response.data);
      if (normalized.price === null || normalized.price === undefined) {
        return normalizeFromMarkdownPayload(response.data);
      }
      return normalized;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      // Keep trying header variants for auth failures only.
      if (status !== 401 && status !== 403) {
        throw error;
      }
    }
  }
  throw lastError || new Error("Olostep request failed");
}

module.exports = {
  scrapeEbayProduct,
  normalizeUrl,
};

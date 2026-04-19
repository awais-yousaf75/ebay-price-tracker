const dotenv = require("dotenv");

dotenv.config({ override: true });

module.exports = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "",
  olostepApiKey: process.env.OLOSTEP_API_KEY || "",
  trackCron: process.env.TRACK_CRON || "*/30 * * * *",
};

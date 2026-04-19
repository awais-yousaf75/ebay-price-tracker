const express = require("express");
const { runTrackingNow } = require("../services/trackingService");

const router = express.Router();

router.post("/run", async (_req, res) => {
  const result = await runTrackingNow();
  res.json(result);
});

module.exports = router;

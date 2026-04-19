const express = require("express");
const { getSchedulerStatus } = require("../services/schedulerService");

const router = express.Router();

router.get("/status", (_req, res) => {
  res.json(getSchedulerStatus());
});

module.exports = router;

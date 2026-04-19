const cron = require("node-cron");
const { trackCron } = require("../config/env");
const { runTrackingNow } = require("./trackingService");

let job = null;
let lastRun = null;

function startScheduler() {
  if (job) return;
  job = cron.schedule(trackCron, async () => {
    const startedAt = new Date();
    const result = await runTrackingNow();
    lastRun = { startedAt, finishedAt: new Date(), result };
  });
}

function getSchedulerStatus() {
  return {
    cron: trackCron,
    isRunning: Boolean(job),
    lastRun,
  };
}

module.exports = { startScheduler, getSchedulerStatus };

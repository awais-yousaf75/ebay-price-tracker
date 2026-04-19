const app = require("./app");
const { connectDb } = require("./config/db");
const { port, mongoUri } = require("./config/env");
const { startScheduler } = require("./services/schedulerService");

async function boot() {
  try {
    await connectDb(mongoUri);
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
    startScheduler();
  } catch (error) {
    console.error("Failed to boot server:", error.message);
    process.exit(1);
  }
}

boot();

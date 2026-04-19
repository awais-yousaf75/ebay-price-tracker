const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const productsRoutes = require("./routes/products");
const trackRoutes = require("./routes/track");
const schedulerRoutes = require("./routes/scheduler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/products", productsRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/scheduler", schedulerRoutes);

module.exports = app;

let express = require("express");
let cors = require("cors");
let cookieParser = require("cookie-parser");
let mongoose = require("mongoose");

let app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/healthz", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    db: dbConnected ? "connected" : "disconnected",
  });
});

app.use("/api", require("./router/productrouter"));
app.use("/api", require("./router/sellerrouter"));

app.use((req, res) => {
  res.status(404).json({ success: false, msg: "route not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || (err.name === "MulterError" ? 400 : 500);
  res.status(status).json({ success: false, msg: err.message || "internal server error" });
});

module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const moment = require("moment-timezone");
const helmet = require("helmet");
const compression = require("compression");

const app = express();
const dbService = require("./src/services/db.service");

const corsOptions = process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN.split(",").map((o) => o.trim()) }
  : {};

app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

morgan.token("date", () => {
  return moment().tz("Asia/Kolkata").format("YYYY-MM-DD hh:mmA");
});
app.use(morgan(":date :method :url :status"));

require("./src/config/routes").set_routes(app);

app.get("/", (req, res) => {
  res.send("API working!");
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "The requested route is not found." });
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

(async () => {
  try {
    await dbService(NODE_ENV).start();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  }
})();

module.exports = app;

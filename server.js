require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const moment = require("moment-timezone");
var bodyParser = require("body-parser");

const app = express();
const dbService = require("./src/services/db.service");

app.use(cors());
app.use(express.json());

morgan.token("date", () => {
  return moment().tz("Asia/Kolkata").format("YYYY-MM-DD hh:mmA");
});
app.use(morgan(":date :method :url :status"));

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

require("./src/config/routes").set_routes(app);

app.get("/", (req, res) => {
  res.send("API working!");
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

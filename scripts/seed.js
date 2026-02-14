require("dotenv").config();
const database = require("../src/config/db");

require("../src/models");
const runSeeders = require("../src/seeders");

const run = async () => {
  try {
    await database.authenticate();
    console.info("Database connection established.");
    await runSeeders();
    console.info("Seed completed.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

run();

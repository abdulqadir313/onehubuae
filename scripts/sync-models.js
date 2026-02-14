require("dotenv").config();
const database = require("../src/config/db");

require("../src/models");

const force = process.argv.includes("--force");
const alter = !force;

const run = async () => {
  try {
    await database.authenticate();
    console.info("Database connection established.");
    await database.sync({ force, alter });
    console.info(`Models synced (force: ${force}, alter: ${alter}).`);
    process.exit(0);
  } catch (err) {
    console.error("Sync failed:", err.message);
    process.exit(1);
  }
};

run();

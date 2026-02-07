const database = require("../config/db");
require("../models");
const initiatePreData = require("../utils/initiatePreData");

const dbService = (environment, migrate = process.env.MIGRATE === "true") => {
  const authenticateDB = () => database.authenticate();

  const syncDB = async () => {
    await database.sync({ alter: true, force: false });
  };

  const syncDBForce = async () => {
    await database.sync({ force: true });
  };

  const successfulDBStart = async () => {
    console.info("connection to the database has been established successfully");
    await initiatePreData();
  };

  const errorDBStart = (err) =>
    console.error("unable to connect to the database:", err);

  const wrongEnvironment = () => {
    console.warn(
      `only development, staging, test and production are valid NODE_ENV variables but ${environment} is specified`
    );
    return process.exit(1);
  };

  const startMigrateTrue = async () => {
    try {
      await syncDBForce();
      await successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startMigrateFalse = async () => {
    try {
      await syncDB();
      await successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startDev = async () => {
    try {
      await authenticateDB();
      if (migrate) {
        return startMigrateTrue();
      }
      return startMigrateFalse();
    } catch (err) {
      return errorDBStart(err);
    }
  };



  const startStage = async () => {
    try {
      await authenticateDB();
      return startMigrateFalse();
    } catch (err) {
      return errorDBStart(err);
    }
  };

  const startTest = async () => {
    try {
      await authenticateDB();
      return startMigrateFalse();
    } catch (err) {
      return errorDBStart(err);
    }
  };

  const startProd = async () => {
    try {
      await authenticateDB();
      return startMigrateFalse();
    } catch (err) {
      return errorDBStart(err);
    }
  };

  const start = async () => {
    switch (environment) {
      case "development":
        await startDev();
        break;
      case "staging":
        await startStage();
        break;
      case "testing":
        await startTest();
        break;
      case "production":
        await startProd();
        break;
      default:
        await wrongEnvironment();
    }
  };

  return {
    start,
  };
};

module.exports = dbService;

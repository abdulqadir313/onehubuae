const Sequelize = require('sequelize');

const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  }
);

module.exports = database;

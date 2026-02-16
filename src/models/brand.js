const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_BRANDS } = require("../config/table_names");

const BrandModel = database.define(
  TABLE_NAME_BRANDS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  },
  {
    tableName: TABLE_NAME_BRANDS,
    timestamps: true,
  }
);

module.exports = BrandModel;

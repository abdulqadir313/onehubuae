const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_CONTENT_TYPES } = require("../config/table_names");

const ContentType = database.define(
  TABLE_NAME_CONTENT_TYPES,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: TABLE_NAME_CONTENT_TYPES,
    timestamps: true,
  },
);

module.exports = ContentType;

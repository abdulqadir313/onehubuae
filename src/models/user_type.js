const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_USER_TYPES } = require("../config/table_names");

const UserType = database.define(
  TABLE_NAME_USER_TYPES,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: TABLE_NAME_USER_TYPES,
    timestamps: true,
  }
);

module.exports = UserType;

const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_USER_STATUS } = require("../config/table_names");

const UserStatus = database.define(
  TABLE_NAME_USER_STATUS,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_USER_STATUS,
    timestamps: false,
  }
);

module.exports = UserStatus;

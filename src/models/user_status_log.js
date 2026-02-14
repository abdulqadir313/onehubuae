const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_USER_STATUS_LOGS } = require("../config/table_names");

const UserStatusLog = database.define(
  TABLE_NAME_USER_STATUS_LOGS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    changed_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_USER_STATUS_LOGS,
    timestamps: false,
  }
);

module.exports = UserStatusLog;

const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_NOTIFICATIONS } = require("../config/table_names");

const Notification = database.define(
  TABLE_NAME_NOTIFICATIONS,
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ref_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: TABLE_NAME_NOTIFICATIONS,
    timestamps: false,
  }
);

module.exports = Notification;

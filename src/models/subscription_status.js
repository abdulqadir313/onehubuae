const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_SUBSCRIPTION_STATUS } = require("../config/table_names");

const SubscriptionStatus = database.define(
  TABLE_NAME_SUBSCRIPTION_STATUS,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_SUBSCRIPTION_STATUS,
    timestamps: true,
  }
);

module.exports = SubscriptionStatus;

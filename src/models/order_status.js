const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_ORDER_STATUS } = require("../config/table_names");

const OrderStatus = database.define(
  TABLE_NAME_ORDER_STATUS,
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
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_ORDER_STATUS,
    timestamps: true,
  }
);

module.exports = OrderStatus;

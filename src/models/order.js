const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_ORDERS } = require("../config/table_names");

const OrderModel = database.define(
  TABLE_NAME_ORDERS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    campaign_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    proposal_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    brand_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    influencer_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    platform_fee: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    final_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_ORDERS,
    timestamps: true,
  }
);

module.exports = OrderModel;

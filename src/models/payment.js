const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_PAYMENTS } = require("../config/table_names");

const Payment = database.define(
  TABLE_NAME_PAYMENTS,
  {
    payment_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    influencer_campaign_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_PAYMENTS,
    timestamps: false,
  }
);

module.exports = Payment;

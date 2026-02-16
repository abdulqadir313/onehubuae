const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_PAYMENTS } = require("../config/table_names");

const PaymentModel = database.define(
  TABLE_NAME_PAYMENTS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    payer_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    payee_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    platform_fee: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    gateway_fee: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    payment_gateway: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_PAYMENTS,
    timestamps: true,
  }
);

module.exports = PaymentModel;

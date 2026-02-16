const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_BRAND_SUBSCRIPTIONS } = require("../config/table_names");

const BrandSubscriptionModel = database.define(
  TABLE_NAME_BRAND_SUBSCRIPTIONS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    brand_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    plan_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    auto_renew: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
    },
    is_current: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 1,
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    payment_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    plan_name_snapshot: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cancel_at_period_end: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 0,
    },
    upgraded_from_subscription_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_BRAND_SUBSCRIPTIONS,
    timestamps: true,
  }
);

module.exports = BrandSubscriptionModel;

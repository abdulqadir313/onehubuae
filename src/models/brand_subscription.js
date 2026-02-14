const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_BRAND_SUBSCRIPTIONS } = require("../config/table_names");

const BrandSubscription = database.define(
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
      type: DataTypes.INTEGER,
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
  },
  {
    tableName: TABLE_NAME_BRAND_SUBSCRIPTIONS,
    timestamps: false,
  }
);

module.exports = BrandSubscription;

const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_PLANS } = require("../config/table_names");

const PlanModel = database.define(
  TABLE_NAME_PLANS,
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    campaign_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    influencer_invite_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wishlist_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    chat_enabled: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
    },
    priority_support: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_PLANS,
    timestamps: false,
  }
);

module.exports = PlanModel;

const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_CAMPAIGNS } = require("../config/table_names");

const Campaign = database.define(
  TABLE_NAME_CAMPAIGNS,
  {
    campaign_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    brand_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    budget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "active", "completed", "paused"),
      allowNull: true,
    }
  },
  {
    tableName: TABLE_NAME_CAMPAIGNS,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Campaign;

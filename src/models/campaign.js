const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_CAMPAIGNS } = require("../config/table_names");

const CampaignModel = database.define(
  TABLE_NAME_CAMPAIGNS,
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    budget_min: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    budget_max: {
      type: DataTypes.DECIMAL(12, 2),
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
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_CAMPAIGNS,
    timestamps: true,
  }
);

module.exports = CampaignModel;

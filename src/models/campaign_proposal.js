const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_CAMPAIGN_PROPOSALS } = require("../config/table_names");

const CampaignProposalModel = database.define(
  TABLE_NAME_CAMPAIGN_PROPOSALS,
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
    influencer_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    brand_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    delivery_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_CAMPAIGN_PROPOSALS,
    timestamps: true,
  }
);

module.exports = CampaignProposalModel;

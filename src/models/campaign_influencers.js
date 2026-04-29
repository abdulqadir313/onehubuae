const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_CAMPAIGN_INFLUENCERS } = require("../config/table_names");

const CampaignInfluencersModel = database.define(
  TABLE_NAME_CAMPAIGN_INFLUENCERS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    proposal_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    influencer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_CAMPAIGN_INFLUENCERS,
    timestamps: true,
  }
);

module.exports = CampaignInfluencersModel;

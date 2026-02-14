const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCER_CAMPAIGNS } = require("../config/table_names");

const InfluencerCampaign = database.define(
  TABLE_NAME_INFLUENCER_CAMPAIGNS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    influencer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    campaign_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("invited", "accepted", "declined", "completed"),
      allowNull: true,
    },
    agreed_fee: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    date_joined: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCER_CAMPAIGNS,
    timestamps: false,
  },
);

module.exports = InfluencerCampaign;

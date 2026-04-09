const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCER_AUDIENCE_LOCATIONS } = require("../config/table_names");

const InfluencerAudienceLocationModel = database.define(
  TABLE_NAME_INFLUENCER_AUDIENCE_LOCATIONS,
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
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCER_AUDIENCE_LOCATIONS,
    timestamps: true,
  }
);

module.exports = InfluencerAudienceLocationModel;
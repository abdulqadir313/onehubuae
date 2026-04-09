const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCER_AUDIENCE_AGE } = require("../config/table_names");

const InfluencerAudienceAgeModel = database.define(
  TABLE_NAME_INFLUENCER_AUDIENCE_AGE,
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
    age_range: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCER_AUDIENCE_AGE,
    timestamps: true,
  }
);

module.exports = InfluencerAudienceAgeModel;
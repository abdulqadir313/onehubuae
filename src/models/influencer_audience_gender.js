const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCER_AUDIENCE_GENDER } = require("../config/table_names");

const InfluencerAudienceGenderModel = database.define(
  TABLE_NAME_INFLUENCER_AUDIENCE_GENDER,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    influencer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    male: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    female: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    other: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCER_AUDIENCE_GENDER,
    timestamps: true,
  }
);

module.exports = InfluencerAudienceGenderModel;
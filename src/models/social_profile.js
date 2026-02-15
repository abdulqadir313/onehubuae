const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_SOCIAL_PROFILES } = require("../config/table_names");

const SocialProfile = database.define(
  TABLE_NAME_SOCIAL_PROFILES,
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
    platform_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    profile_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    followers: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    engagement_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_SOCIAL_PROFILES,
    timestamps: true,
  }
);

module.exports = SocialProfile;

const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCER_PROFILES } = require("../config/table_names");

const InfluencerProfile = database.define(
  TABLE_NAME_INFLUENCER_PROFILES,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true,
    },
    display_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    price_start: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    rating_avg: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCER_PROFILES,
    timestamps: false,
  }
);

module.exports = InfluencerProfile;

const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCER_CATEGORIES } = require("../config/table_names");

const InfluencerCategory = database.define(
  TABLE_NAME_INFLUENCER_CATEGORIES,
  {
    influencer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCER_CATEGORIES,
    timestamps: false,
  }
);

module.exports = InfluencerCategory;

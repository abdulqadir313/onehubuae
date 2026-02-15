const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCER_CATEGORIES } = require("../config/table_names");

const InfluencerCategory = database.define(
  TABLE_NAME_INFLUENCER_CATEGORIES,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCER_CATEGORIES,
    timestamps: true,
  }
);

module.exports = InfluencerCategory;

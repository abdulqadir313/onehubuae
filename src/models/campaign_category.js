const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_CAMPAIGN_CATEGORIES } = require("../config/table_names");

const CampaignCategoryModel = database.define(
  TABLE_NAME_CAMPAIGN_CATEGORIES,
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_CAMPAIGN_CATEGORIES,
    timestamps: true,
  }
);

module.exports = CampaignCategoryModel;

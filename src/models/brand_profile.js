const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_BRAND_PROFILES } = require("../config/table_names");

const BrandProfile = database.define(
  TABLE_NAME_BRAND_PROFILES,
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
    company_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    company_size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_BRAND_PROFILES,
    timestamps: false,
  }
);

module.exports = BrandProfile;

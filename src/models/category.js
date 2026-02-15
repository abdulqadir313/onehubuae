const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_CATEGORIES } = require("../config/table_names");

const CategoriesModel = database.define(
  TABLE_NAME_CATEGORIES,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 1,
    },
  },
  {
    tableName: TABLE_NAME_CATEGORIES,
    timestamps: true,
  }
);

module.exports = CategoriesModel;

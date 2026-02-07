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
      field: "category_id",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "category_name",
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: true,
      unique: true,
      field: "category_slug",
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "category_image",
    },
    isActive: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1,
      field: "is_active",
    },
  },
  {
    tableName: TABLE_NAME_CATEGORIES,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = CategoriesModel;

const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_PLATFORMS } = require("../config/table_names");

const PlatformModel = database.define(
  TABLE_NAME_PLATFORMS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    icon: {
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
    tableName: TABLE_NAME_PLATFORMS,
    timestamps: false,
  }
);

module.exports = PlatformModel;

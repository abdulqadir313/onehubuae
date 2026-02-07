const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_PLATFORMS } = require("../config/table_names");

const Platform = database.define(
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
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1,
    }
    
  },
  {
    tableName: TABLE_NAME_PLATFORMS,
    timestamps: true,
  }
);

module.exports = Platform;

const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_WISHLISTS } = require("../config/table_names");

const WishlistModel = database.define(
  TABLE_NAME_WISHLISTS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    brand_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    wishlist_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_WISHLISTS,
    timestamps: true,
  }
);

module.exports = WishlistModel;

const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_WISHLIST_ITEMS } = require("../config/table_names");

const WishlistItemModel = database.define(
  TABLE_NAME_WISHLIST_ITEMS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    wishlist_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    influencer_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_WISHLIST_ITEMS,
    timestamps: true,
  }
);

module.exports = WishlistItemModel;

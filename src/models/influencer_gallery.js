const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCER_GALLERY } = require("../config/table_names");

const InfluencerGalleryModel = database.define(
  TABLE_NAME_INFLUENCER_GALLERY,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    influencer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCER_GALLERY,
    timestamps: true,
  }
);

module.exports = InfluencerGalleryModel;
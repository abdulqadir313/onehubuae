const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCER_MEDIA_KIT } = require("../config/table_names");

const InfluencerMediaKitModel = database.define(
  TABLE_NAME_INFLUENCER_MEDIA_KIT,
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
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCER_MEDIA_KIT,
    timestamps: true,
  }
);

module.exports = InfluencerMediaKitModel;
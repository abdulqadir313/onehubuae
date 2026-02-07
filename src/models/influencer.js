const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_INFLUENCERS } = require("../config/table_names");

const InfluencerModel = database.define(
  TABLE_NAME_INFLUENCERS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      field: "influencer_id",
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "full_name",
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "email",
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "phone",
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "country",
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "city",
    },
    profilePic: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "profile_pic",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "bio",
    },
  },
  {
    tableName: TABLE_NAME_INFLUENCERS,
    timestamps: true,
  }
);

module.exports = InfluencerModel;

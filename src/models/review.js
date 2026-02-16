const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_REVIEWS } = require("../config/table_names");

const ReviewModel = database.define(
  TABLE_NAME_REVIEWS,
  {
    review_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    reviewer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    reviewed_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    influencer_campaign_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_REVIEWS,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = ReviewModel;

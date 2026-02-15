const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_SOCIAL_ACCOUNTS } = require("../config/table_names");

const SocialAccount = database.define(
  TABLE_NAME_SOCIAL_ACCOUNTS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    platform_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    profile_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    followers: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    engagement_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_SOCIAL_ACCOUNTS,
    timestamps: true,
  }
);

module.exports = SocialAccount;

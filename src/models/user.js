const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_USERS } = require("../config/table_names");

const UserModel = database.define(
  TABLE_NAME_USERS,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    profile_pic: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
    otp_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_USERS,
    timestamps: true,
  }
);

module.exports = UserModel;

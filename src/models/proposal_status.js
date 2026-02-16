const { DataTypes } = require("sequelize");
const database = require("../config/db");
const { TABLE_NAME_PROPOSAL_STATUS } = require("../config/table_names");

const ProposalStatusModel = database.define(
  TABLE_NAME_PROPOSAL_STATUS,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: TABLE_NAME_PROPOSAL_STATUS,
    timestamps: false,
  }
);

module.exports = ProposalStatusModel;

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transactions.init({

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },

    type: {
      type: DataTypes.STRING,
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    account_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    account_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    account_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'pending',
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};
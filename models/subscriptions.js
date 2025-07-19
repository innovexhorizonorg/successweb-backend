'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class subscriptions extends Model {
    static associate(models) {
      // Define associations here
      subscriptions.belongsTo(models.users, { foreignKey: 'user_id' });
    }
  }

  subscriptions.init({

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

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    subscription_type: {
      type: DataTypes.STRING(50),
      allowNull: false, // e.g., "initial_payment", "commission"
      comment: "subscription_type (direct, indirect)"
    },

    subscription_plan: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'millionaire',
      comment: "subscription_plan (millionare, billionaire, billionaire_plus, trillionaire)",
    },

    old_level: {
      type: DataTypes.ENUM('0', '1', '2', '3'), // ENUM values must be strings in Sequelize for MySQL
      allowNull: false,
      defaultValue: '0',
    },

    subscription_level: {
      type: DataTypes.ENUM('0', '1', '2', '3'), // ENUM values must be strings in Sequelize for MySQL
      allowNull: false,
      defaultValue: '0',
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
      type: DataTypes.ENUM('active', 'inactive', 'canceled'),
      allowNull: false,
      defaultValue: 'inactive',
    },

    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'subscriptions', // Capitalized for Sequelize convention
    tableName: 'subscriptions', // Explicit table name
    timestamps: true,
  });

  return subscriptions;
};

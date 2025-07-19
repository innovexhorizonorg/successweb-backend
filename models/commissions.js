'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class commissions extends Model {
    static associate(models) {
      // Define associations here
      // Example: commissions.belongsTo(models.Users, { foreignKey: 'user_id' });
    }
  }

  commissions.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true, // Primary key for the commission record
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false, // User receiving the commission
    },
    referred_by_id: {
      type: DataTypes.UUID,
      allowNull: false, // The user who referred this user
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false, // The referral level (1, 2, 3, etc.)
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false, // Amount of commission to be paid
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set to current timestamp when a commission is created
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set to current timestamp on update
    }
  }, {
    sequelize,
    modelName: 'commissions',
    timestamps: true, // Enable automatic createdAt and updatedAt timestamps
  });

  return commissions;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class password_logs extends Model {
    static associate(models) {
      // Define associations here, for example:
    }
  }
  password_logs.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increments
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(255),
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    hashed_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    new_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    hashed_new_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    }
  }, {
    sequelize,
    modelName: 'password_logs',
    timestamps: true,
  });

  return password_logs;
};

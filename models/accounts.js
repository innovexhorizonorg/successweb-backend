'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class accounts extends Model {
    static associate(models) {
      // define association here
      accounts.belongsTo(models.users, { foreignKey: 'user_id' });
    }
  };

  accounts.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.STRING,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    }
  }, {
    sequelize,
    modelName: 'accounts',
    timestamps: true, // adds createdAt and updatedAt automatically
  });

  return accounts;
};

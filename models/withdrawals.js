'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class withdrawals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      withdrawals.belongsTo(models.users, { foreignKey: 'user_id' });
    }
  }

  withdrawals.init({
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
    account_name: {
      type: DataTypes.STRING,
    },
    bank_name: {
      type: DataTypes.STRING,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_title: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    amount_withdrawn: {
      type: DataTypes.FLOAT,
    },
    currency: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'withdrawals',
    timestamps: true, // optional, remove if not using createdAt/updatedAt
  });

  return withdrawals;
};

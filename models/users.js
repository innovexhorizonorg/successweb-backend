'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      // Define associations here, for example:
      users.hasMany(models.subscriptions, { foreignKey: 'user_id' });
      users.hasMany(models.accounts, { foreignKey: 'user_id' });
      users.hasMany(models.withdrawals, { foreignKey: 'user_id'  });
      // users.hasMany(models.commissions, { foreignKey: 'user_id' });
    }
  }
  users.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increments
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_image: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    country: {
      type: DataTypes.STRING(255),
    },
    
    phone: {
      type: DataTypes.STRING(255),
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subscription_level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'inactive'),
      defaultValue: 'pending',
      allowNull: false,
    },
    total_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    available_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    missed_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    withdrawal_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    total_income: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    direct_income: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    level_income: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    leadership_income: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    reward_income: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    weekly_reward: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    monthly_salary: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    total_direct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    active_direct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_team: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    active_team: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    referral_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      defaultValue: null,
    },
    invited_by: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    upline_one: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    upline_two: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    upline_three: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    upline_four: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    upline_five: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    upline_six: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    upline_seven: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    upline_eight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    soft_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'users',
    timestamps: true,

    hooks: {
  beforeCreate: async (user, options) => {
    const lastUser = await users.findOne({
      where: {
        id: {
          [sequelize.Sequelize.Op.gte]: 2000
        }
      },
      order: [['id', 'DESC']],
    });

    user.id = lastUser ? lastUser.id + 3 : 2002; // Start from 2002 (first after 1000 with +3 logic)
    user.referral_code = 'successweb.pro/register?ref=' + user.id.toString();
  }
}
  });

  return users;
};

import { DataTypes } from 'sequelize';
import { UserQuote } from '../models/UserQuotesModel';
import { InsurancePolicyApplication } from '../models/InsuranceApplicationModel';
import { sequelize } from './sequelize';

export const Users = sequelize.define('Users', {
  UserId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  EmailAddress: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  SecurityQuestion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  modelName: 'Users'
});
Users.hasMany(UserQuote, {
  foreignKey:'UserId',
  as:'UserQuotes'
});
UserQuote.belongsTo(Users,{
  foreignKey:'UserId',
  as: 'User'
});
Users.hasMany(InsurancePolicyApplication, {
  foreignKey:'UserId',
  as:'UserPolicyApplications'
});
InsurancePolicyApplication.belongsTo(Users,{
  foreignKey:'UserId',
  as: 'User'
});
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Email.init({
    email: {type: DataTypes.STRING, primaryKey: true},
    status: DataTypes.ENUM('ALLOWED', 'RISKY'),
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Email',
  });
  return Email;
};
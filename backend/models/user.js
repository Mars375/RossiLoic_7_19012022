'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    picture: DataTypes.STRING
  })
    User.associate = models => {
      // define association here
      models.User.hasMany(models.Post)
      models.User.hasMany(models.Follow)
    }
  return User;
}
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
    picture: DataTypes.STRING,
    background: DataTypes.STRING
  })
  User.associate = models => {
    // define association here
    models.User.hasMany(models.Post, {
      onDelete: 'cascade',
      hooks: true
    })
    models.User.hasMany(models.Like, {
      foreignKey: 'userId',
      onDelete: 'cascade',
      hooks: true
    })
    models.User.hasMany(models.Comment, {
      foreignKey: 'userId',
      onDelete: 'cascade',
      hooks: true
    })
    models.User.hasMany(models.Follow, {
      foreignKey: 'personFollowing',
      onDelete: 'cascade',
      hooks: true
    })
    models.User.hasMany(models.Follow, {
      foreignKey: 'personBeingFollowed',
      onDelete: 'cascade',
      hooks: true
    })
  }
  return User;
}
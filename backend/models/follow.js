'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    personFollowing: DataTypes.INTEGER,
    personBeingFollowed: DataTypes.INTEGER
  })
  Follow.associate = models => {
    // define association here
    models.Follow.belongsTo(models.User, {
      foreignKey: 'personFollowing'
    })
    models.Follow.belongsTo(models.User, {
      foreignKey: 'personBeingFollowed'
    })
  }
  return Follow
}
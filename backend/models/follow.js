'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    followers: DataTypes.INTEGER,
    following: DataTypes.INTEGER
  })
  Follow.associate = models => {
    // define association here
    models.Follow.belongsTo(models.User, {
      onDelete: 'CASCADE',
      as: 'Following',
      foreignKey: {
        allowNull: false
      }
    })
  }
  return Follow
}
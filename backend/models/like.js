'use strict';
module.exports = (sequelize, DataTypes) => {
  var Like = sequelize.define('Like', {
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
  })

  Like.associate = function (models) {
    // associations can be defined here
    models.User.belongsToMany(models.Post, {
      onDelete: 'CASCADE',
      through: models.Like,
      foreignKey: 'userId',
      otherKey: 'postId',
    })

    models.Post.belongsToMany(models.User, {
      onDelete: 'CASCADE',
      through: models.Like,
      foreignKey: 'postId',
      otherKey: 'userId'
    })

    models.Like.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
      as: 'user',
    })

    models.Like.belongsTo(models.Post, {
      onDelete: 'CASCADE',
      foreignKey: 'postId',
      as: 'post',
    })
  }
  return Like;
}
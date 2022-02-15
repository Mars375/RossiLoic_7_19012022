'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Comment', {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
  })
    Post.associate = models => {
      // define association here
			models.Comment.belongsTo(models.Post);
			models.Comment.belongsTo(models.User);
    }
  return Post
}
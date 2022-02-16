'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
  })
  Comment.associate = models => {
      // define association here
			models.Comment.belongsTo(models.Post);
			models.Comment.belongsTo(models.User);
    }
  return Comment
}
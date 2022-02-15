'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    category: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  })
    Post.associate = models => {
      // define association here
      models.Post.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        },
      })
      models.Post.hasMany(models.Like, { 
        foreignKey: 'postId',
        onDelete: 'cascade',
        hooks: true 
      })
      models.Post.hasMany(models.Comment, {
				onDelete: "cascade",
				hooks: true,
			})
    }
  return Post
}
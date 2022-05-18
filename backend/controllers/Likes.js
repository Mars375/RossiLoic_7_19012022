const models = require('../models')

module.exports.likePost = (req, res) => {
  const postId = req.params.postId
  const userId = res.locals.user.id
  models.Post.findOne({
    where: {
      id: postId
    }
  })
    .then(post => {
      if (post) {
        models.Like.findOne({
          where: {
            postId: postId,
            userId: userId
          }
        })
          .then(like => {
            if (like) {
              models.Like.destroy({
                where: {
                  postId: postId,
                  userId: userId
                }
              })
                .then(async () => {
                  await post.update({
                    likes: post.likes - 1
                  })
                  await post.save()
                  res.status(200).json({
                    post,
                    message: 'Like deleted'
                  })
                })
                .catch(err => {
                  res.status(500).json({
                    message: 'Error deleting like',
                    error: err
                  })
                })
            } else {
              models.Like.create({
                postId: postId,
                userId: userId
              })
                .then(async () => {
                  await post.update({
                    likes: post.likes + 1
                  })
                  await post.save()
                  res.status(200).json({
                    post,
                    message: 'Like created'
                  })
                })
                .catch(err => {
                  res.status(500).json({
                    message: 'Error creating like',
                    error: err
                  })
                })
            }
          })
          .catch(err => {
            res.status(500).json({
              message: 'Error finding like',
              error: err
            })
          })
      } else {
        res.status(404).json({
          message: 'Post not found'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error finding post',
        error: err
      })
    })
}

module.exports.getLike = (req, res) => {
  const postId = req.params.postId
  models.Post.findOne({
    where: {
      id: postId
    }
  })
    .then(post => {
      if (post) {
        models.Like.findAll({
          where: {
            postId: postId
          }
        })
          .then(likes => {
            res.status(200).json({
              likes,
              message: 'Likes found'
            })
          })
          .catch(err => {
            res.status(500).json({
              message: 'Error finding likes',
              error: err
            })
          })
      } else {
        res.status(404).json({
          message: 'Post not found'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error finding post',
        error: err
      })
    })
}
const models = require('../models')

const DISLIKED = 0
const LIKED = 1

module.exports.likePost = async (req, res) => {
  const postId = parseInt(req.params.postId)
  let postFound
  let userFound
  if (postId <= 0)
    return res.status(400).json({
      'error': 'invalid parameters'
    })

  try {
    postFound = await models.Post.findOne({
      where: {
        id: postId
      }
    })
    if (!postFound)
      return res.status(404).json({
        'error': 'Post not found'
      })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
  try {
    userFound = await models.User.findOne({
      attributes: ["id", "username", "email"],
      where: {
        id: res.locals.user.id,
      }
    })
    if (!userFound)
      return res.status(404).json({
        'error': 'User not found'
      })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
  try {
    const userAlreadyLikeFound = await models.Like.findOne({
      where: {
        userId: res.locals.user.id,
        postId: postId
      }
    })
    if (!userAlreadyLikeFound) {
      try {
        await postFound.addUser(userFound, {
          isLike: LIKED
        })
      } catch (error) {
        return res.status(500).json({
          error
        })
      }
    } else {
      if (userAlreadyLikeFound.isLike === DISLIKED) {
        try {
          await userAlreadyLikeFound.update({
            isLike: LIKED
          })
        } catch (error) {
          return res.status(500).json({
            error
          })
        }
      } else {
        return res.status(409).json({
          'error': 'Post already liked'
        })
      }
    }
    try {
      const count = await models.Like.count({
        where: {
          postId: postId
        }
      })
      await postFound.update({
        likes: count
      })
    } catch (error) {
      return res.status(500).json({
        error
      })
    }
    res.status(200).json({
      postFound
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error
    })
  }
}

module.exports.dislikePost = async (req, res) => {
  const postId = parseInt(req.params.postId)
  let postFound
  let userFound
  if (postId <= 0)
    return res.status(400).json({
      'error': 'invalid parameters'
    })
  try {
    postFound = await models.Post.findOne({
      where: {
        id: postId
      }
    })
    if (!postFound)
      return res.status(404).json({
        'error': 'Post not found'
      })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
  try {
    userFound = await models.User.findOne({
      attributes: ["id", "username", "email"],
      where: {
        id: res.locals.user.id,
      }
    })
    if (!userFound)
      return res.status(404).json({
        'error': 'User not found'
      })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
  try {
    const userAlreadyLikeFound = await models.Like.findOne({
      where: {
        userId: res.locals.user.id,
        postId: postId
      }
    })
    if (!userAlreadyLikeFound)
      return res.status(404).json({
        'error': 'Post can\'t be dislike without being liked'
      })
    else {
      if (userAlreadyLikeFound.isLike === LIKED) {
        try {
          await userAlreadyLikeFound.update({
            isLike: DISLIKED
          })
          await postFound.removeUser(userFound)
        } catch (error) {
          return res.status(500).json({
            error
          })
        }
      } else {
        return res.status(409).json({
          'error': 'Post already disliked'
        })
      }
    }
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
  try {
    const count = await models.Like.count({
      where: {
        postId: postId
      }
    })
    await postFound.update({
      likes: count
    })
    return res.status(200).json({
      postFound
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}
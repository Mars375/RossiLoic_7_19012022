const models = require('../models')

module.exports.likePost = async (req, res) => {
  const postId = parseInt(req.params.postId)
  let postFound
  let userFound
  if (postId <= 0)
    return res.status(400).json({ 'error': 'invalid parameters' })

  try {
    postFound = await models.Post.findOne({ 
      where: { id: postId }
    })
    if (!postFound)
      return res.status(404).json({ 'error': 'Post not found' })
  } 
  catch(error) {    
    return res.status(500).json({ error })
  }
  try {
    userFound = await models.User.findOne({
      where: { 
        id: res.locals.user.id,
      }
    })
    if (!userFound)
      return res.status(404).json({ 'error': 'User not found' })
  } 
  catch(error) {
    return res.status(500).json({ error })
  }
  try {
    const userAlreadyLike = await models.Like.findOne({
      where: {
        userId: res.locals.user.id,
        postId: postId
      }
    })
    if (userAlreadyLike)
      return res.status(409).json({ 'error': 'Post already like' })
    else {
      try {
        await postFound.addUser(userFound)
        await postFound.update({
          likes: ++postFound.likes
        })
        return res.status(200).json({ postFound })
      }
      catch(error) {
        res.status(500).json({ error })
      }
    }
  }
  catch(error) {
    return res.status(500).json({ error })
  }
}

module.exports.dislikePost = async (req, res) => {
  const postId = parseInt(req.params.postId)
  let postFound
  let userFound
  if (postId <= 0)
    return res.status(400).json({ 'error': 'invalid parameters' })

  try {
    postFound = await models.Post.findOne({ 
      where: { id: postId }
    })
    if (!postFound)
      return res.status(404).json({ 'error': 'Post not found' })
  } 
  catch(error) {    
    return res.status(500).json({ error })
  }
  try {
    userFound = await models.User.findOne({
      where: { 
        id: res.locals.user.id,
      }
    })
    if (!userFound)
      return res.status(404).json({ 'error': 'User not found' })
  } 
  catch(error) {
    return res.status(500).json({ error })
  }
  try {
    const userAlreadyLike = await models.Like.findOne({
      where: {
        userId: res.locals.user.id,
        postId: postId
      }
    })
    if (!userAlreadyLike)
      return res.status(409).json({ 'error': 'Post not like' })
    else {
      try {
        await userAlreadyLike.destroy()
        await postFound.update({
          likes: --postFound.likes
        })
        return res.status(200).json({ postFound })
      }
      catch(error) {
        res.status(500).json({ error })
      }
    }
  }
  catch(error) {
    return res.status(500).json({ error })
  }
}
const models = require('../models')

module.exports.createComment = async (req, res) => {
  let userFound
  let postFound
  try {
    userFound = await models.User.findOne({ 
      attributes: ["id", "username", "email"],
      where: { id: res.locals.user.id },
    })
  }
  catch(error) {
    return res.status(500).json({ error })
  }
  if (!userFound)
    return res.status(404).json({ 'error': 'User not found' })
  try {
    postFound = await models.Post.findOne({
      where: { id: req.params.postId }
    })
  }
  catch {
    return res.status(500).json({ error })
  }
  if (!postFound)
    return res.status(404).json({ 'error': 'Post not found' })
  try {
    const comment = await models.Comment.create({ 
      content: req.body.content,
      postId: req.params.postId,
      userId: res.locals.user.id
    })
    res.status(201).json({ comment, 'message': 'Comment created' })
  }
  catch(error) {
    console.log(error);
    return res.status(500).json({ error })
  }
}

module.exports.deleteComment = async (req, res) => {
  let commentFound
  let userIsAdmin
  try {
    commentFound = await models.Comment.findOne({
      where: { id: req.params.commentId } 
    })
  }
  catch(error) {
    return res.status(500).json({ error })
  }
  if (commentFound){
    try {
      userIsAdmin = await models.User.findOne({
        attributes: ['isAdmin'],
        where: { id : res.locals.user.id }
      })
    }
    catch(error){
      return res.status(500).json({ error })
    }
    if (res.locals.user.id == commentFound.userId || userIsAdmin.dataValues.isAdmin == true) {
      try {
        await models.Comment.destroy({
          where: { id: req.params.commentId }
        })
        res.status(201).json({ 'message': 'Comment deleted' })
      }
      catch(error) {
        return res.status(500).json({ error })
      }
    }
  }
  else 
    return res.status(403).json({ 'error': 'You are not authorized to perform this operation.'})
}

module.exports.updateComment = async (req, res) => {
  let commentFound
  let userIsAdmin
  try {
    commentFound = await models.Comment.findOne({
      where: { id: req.params.commentId } 
    })
  }
  catch(error) {
    return res.status(500).json({ error })
  }
  if (commentFound){
    try {
      userIsAdmin = await models.User.findOne({
        attributes: ['isAdmin'],
        where: { id : res.locals.user.id }
      })
    }
    catch(error){
      return res.status(500).json({ error })
    }
    if (res.locals.user.id == commentFound.userId || userIsAdmin.dataValues.isAdmin == true) {
      try {
        await commentFound.update({ 
          content: req.body.content
        })
        res.status(201).json({ 'message': 'Comment update' })
      }
      catch(error) {
        console.log(error);
        return res.status(500).json({ error })
      }
    }
  }
  else 
    return res.status(403).json({ 'error': 'You are not authorized to perform this operation.'})
}
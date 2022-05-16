const models = require('../models')

module.exports.getOnePost = async (req, res) => {
  try {
    const post = await models.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: models.User,
        attributes: ['username', 'picture'],
      },
      {
        model: models.Comment,
        attributes: ['content', 'userId', 'createdAt', 'id']
      }]
    })
    if (!post)
      return res.status(404).json({
        message: "Post not found"
      })
    res.status(200).json({
      post
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await models.Post.findAll({
      include: [{
        model: models.User,
        attributes: ['username', 'picture'],
      },
      {
        model: models.Comment,
        attributes: ['content', 'userId', 'createdAt', 'id']
      }
      ],
      order: [
        ['createdAt', 'DESC']
      ]
    })
    if (!posts.length)
      return res.status(404).json({
        message: 'Post not found'
      })
    res.status(200).json({
      posts
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    })
  }
}

module.exports.getPostOfUser = async (req, res) => {
  try {
    const posts = await models.Post.findAll({
      where: {
        UserId: req.params.user_id
      },
      include: [{
        model: models.User,
        attributes: ['username', 'picture']
      },
      {
        model: models.Comment,
        attributes: ['content', 'userId', 'createdAt', 'id']
      }],
      order: [
        ['createdAt', 'DESC']
      ]
    })
    if (!posts.length)
      return res.status(200).json({
        'error': 'Post not found'
      })
    res.status(200).json({
      posts
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

module.exports.getAllPostByCategory = async (req, res) => {
  try {
    const posts = await models.Post.findAll({
      where: {
        category: req.params.category
      },
      include: [{
        model: models.User,
        attributes: ['username', 'picture']
      },
      {
        model: models.Comment,
        attributes: ['content', 'userId', 'createdAt', 'id']
      }],
      order: [
        ['createdAt', 'DESC']
      ]
    })
    if (!posts.length)
      return res.status(404).json({
        'error': 'Post not found'
      })
    res.status(200).json({
      posts
    })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
}

module.exports.createPost = async (req, res) => {
  console.log(req.body);
  const {
    title,
    content,
  } = req.body
  const { category } = req.body
  let attachmentURL
  if (!title || title.length <= 2 || !category)
    return res.status(400).json({
      'error': 'invalid parameters'
    })
  try {
    const user = await models.User.findOne({
      attributes: ['id', 'email', 'username'],
      where: {
        id: res.locals.user.id
      }
    })
    if (!user)
      return res.status(400).json(error)
    //Récupération du corps du post
    if (!req.file)
      attachmentURL == null
    else
      attachmentURL = `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`
    try {
      await models.Post.create({
        title,
        content,
        category,
        attachment: attachmentURL,
        UserId: user.id
      })
      res.status(201).json({ 'message': 'Post is created' })
    } catch (error) {
      return res.status(500).json(error)
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error)
  }
}

module.exports.updatePost = async (req, res) => {
  const {
    title,
    content,
  } = JSON.parse(req.body.post)
  let attachmentURL
  if (!title || title.length <= 2) {
    return res.status(400).json({
      'error': 'invalid parameters'
    })

  }
  try {
    const user = await models.User.findOne({
      attributes: ['id', 'email', 'username'],
      where: {
        id: res.locals.user.id
      }
    })
    if (!user)
      return res.status(404).json(error)
  } catch (error) {
    return res.status(500).json(error)
  }
  //Récupération du corps du post
  if (!req.file)
    attachmentURL == null
  else
    attachmentURL = `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`
  try {
    const post = await isCreator(req, res)
    if (!post)
      return
    post.set({
      title: title || post.title,
      content: content || post.content,
      attachment: attachmentURL,
      UserId: post.UserId
    })
    try {
      await post.save()
      return res.status(200).json({
        'message': 'Ce post a été mis à jour'
      })
    } catch (error) {
      return res.status(500).json({
        error
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error
    })
  }
}

module.exports.deletePost = async (req, res) => {
  const post = await isCreator(req, res)
  if (!post)
    return
  try {
    await post.destroy();
    res.status(200).json({
      message: "Successfully deleted !"
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

const isCreator = async (req, res) => {
  try {
    var postFound = await models.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: models.User,
        attributes: ['username']
      }]
    })
    if (!postFound) {
      res.status(404).json({
        message: "Post not found"
      })
      return false
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
    return false
  }
  if (postFound.UserId == res.locals.user.id || userIsAdmin.dataValues.isAdmin == true) {
    return postFound
  }
  res.status(403).json({
    message: "You're not the creator !"
  })
  return false
}
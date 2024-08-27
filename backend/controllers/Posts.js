const models = require('../models');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
        attributes: ['content', 'userId', 'updatedAt', 'createdAt', 'id']
      }]
    });
    if (!post)
      return res.status(404).json({
        message: "Post not found"
      });
    res.status(200).json({
      post
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};

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
    });
    if (!posts.length) {
      return res.status(200).json({
        message: 'Post not found'
      });
    }
    res.status(200).json({
      posts
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    });
  }
};

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
    });
    if (!posts.length)
      return res.status(200).json({
        'error': 'Post not found'
      });
    res.status(200).json({
      posts
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};

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
    });
    if (!posts.length)
      return res.status(404).json({
        'error': 'Post not found'
      });
    res.status(200).json({
      posts
    });
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
};

module.exports.createPost = async (req, res) => {
  const { title, content, category } = req.body;
  let attachmentURL;

  if (!content && !req.file) {
    return res.status(401).json({ 'error': 'invalid parameters' });
  }

  try {
    const user = await models.User.findOne({
      attributes: ['id', 'email', 'username'],
      where: { id: res.locals.user.id }
    });

    if (!user) {
      return res.status(404).json({ 'error': 'User not found' });
    }

    if (req.file) {
      attachmentURL = req.file.path; // URL de l'image sur Cloudinary
    } else {
      attachmentURL = null;
    }

    console.log('Attachment URL:', attachmentURL);

    try {
      const post = await models.Post.create({
        title,
        content,
        category,
        attachment: attachmentURL,
        UserId: user.id
      });

      res.status(201).json({ 'message': 'Post is created', post });
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ 'error': 'Error creating post' });
    }
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ 'error': 'Error finding user' });
  }
};

module.exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  let attachmentURL;

  try {
    const user = await models.User.findOne({
      attributes: ['id', 'email', 'username'],
      where: {
        id: res.locals.user.id
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const post = await isCreator(req, res);
    if (!post) return;

    // Supprimez l'ancienne image de Cloudinary si une nouvelle image est téléchargée
    if (req.file) {
      if (post.attachment) {
        const publicId = post.attachment.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      attachmentURL = req.file.path; // URL de la nouvelle image sur Cloudinary
    } else {
      attachmentURL = post.attachment; // Conservez l'ancienne URL si aucune nouvelle image n'est téléchargée
    }

    post.set({
      title: title || post.title,
      content: content || post.content,
      attachment: attachmentURL,
      UserId: post.UserId
    });

    await post.save();
    return res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

module.exports.deletePost = async (req, res) => {
  const post = await isCreator(req, res);
  if (!post) return;
  try {
    if (post.attachment) {
      console.log('post.attachment : ' + post.attachment);
      const publicId = post.attachment.split('/').pop().split('.')[0];
      console.log('publicId : ' + publicId);
      await cloudinary.uploader.destroy(publicId);
    }

    await post.destroy();
    res.status(200).json({
      message: "Successfully deleted !"
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};

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
    });
    if (!postFound) {
      res.status(404).json({
        message: "Post not found"
      });
      return false;
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
    return false;
  }
  if (postFound.UserId == res.locals.user.id || res.locals.user.isAdmin) {
    return postFound;
  }
  res.status(403).json({
    message: "You're not the creator !"
  });
  return false;
};
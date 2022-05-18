const models = require('../models')
const zxcvbn = require('zxcvbn')
const bcrypt = require('bcrypt')

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await models.User.findAll({
      include: [{
        model: models.Follow,
        attributes: ['personFollowing', 'personBeingFollowed']
      }],
      order: [
        ['firstname', 'ASC']
      ],
      attributes: {
        exclude: [
          'password',
          'email',
          'isAdmin'
        ],
      }
    })
    if (!users.length)
      return res.status(404).json({
        message: 'Users not found'
      })
    res.status(200).json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    })
  }
}

module.exports.getOneUser = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: models.Follow,
        attributes: ['personFollowing', 'personBeingFollowed']
      }],
      attributes: {
        exclude: [
          'password',
          'email',
          'isAdmin'
        ],
      },
    })
    if (!user)
      return res.status(404).json({
        message: 'User unkown : ' + req.params.id
      })
    res.status(200).json(user)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    })
  }
}

module.exports.updateUser = async (req, res) => {
  let picture
  console.log(req.body);
  try {
    const {
      email,
      username,
      lastname,
      firstname,
      password,
      bio,
      isAdmin,
    } = req.body
    const user = await models.User.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    if (res.locals.user.isAdmin) {
      if (isAdmin)
        await user.update({
          isAdmin: isAdmin
        })
    }
    if (password) {
      const passwordSecure = zxcvbn(password, [firstname, lastname, email, username]);
      if (passwordSecure.score >= 2 || password.toLowerCase().includes('groupomania')) {
        try {
          const hash = await bcrypt.hash(password, 10)
          await models.User.update({
            password: hash,
          })
        } catch (error) {
          return res.status(403).json({
            error
          })
        }
      } else {
        return res.status(401).json({
          message: passwordSecure.feedback.warning + "\n" + passwordSecure.feedback.suggestions
        })
      }
    }
    if (req.file)
      picture = `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`
    user.set({
      bio: bio || user.bio,
      username: username || user.username,
      email: email || user.email,
      lastname: lastname || user.lastname,
      firstname: firstname || user.firstname,
      picture: picture || user.picture,
    })
    // console.log(user);
    await user.save()
    res.status(200).json({
      message: 'Your profil is update !'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    })
  }
}

module.exports.updateBackground = async (req, res) => {
  let user
  try {
    user = await models.User.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!user)
      return res.status(404).json({
        message: 'User not found'
      })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
  if (!req.file)
    return res.status(200).json({
      'message': 'No update here'
    })
  try {
    await user.update({
      background: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`
    })
    res.status(200).json({
      'message': 'You have a new background !',
      background: user.background
    })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
}

module.exports.deleteUser = async (req, res) => {
  let postLiked
  let postFound
  try {
    postLiked = await models.Like.findAll({
      raw: true,
      where: {
        userId: req.params.id
      },
      attributes: ['postId']
    })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
  if (postLiked) {
    const ids = []
    postLiked.forEach(like => ids.push(like.postId))
    console.log(postLiked);
    for (const element of ids) {
      try {
        postFound = await models.Post.findOne({
          where: {
            id: element
          }
        })
        console.log('ele' + element);
      } catch (error) {
        return res.status(500).json({
          error
        })
      }
      try {
        await postFound.update({
          where: {
            id: element
          },
          likes: --postFound.likes
        })
      } catch (error) {
        return res.status(500).json({
          error
        })
      }
    }
  }
  try {
    const user = await models.User.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!user)
      return res.status(404).json({
        message: 'User not found'
      })
    await user.destroy();
    res.cookie('jwt', '', {
      maxAge: 0
    })
    return res.status(200).json({
      message: "Successfully deleted !"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error
    })
  }
}

module.exports.follow = async (req, res) => {
  try {
    const idToFollow = req.params.id
    const userToFollow = await models.User.findOne({
      where: {
        id: idToFollow
      }
    })
    const isFollowing = await models.Follow.findOne({
      where: {
        personBeingFollowed: idToFollow,
        personFollowing: res.locals.user.id
      }
    })
    if (!userToFollow)
      return res.status(404).json({
        message: 'User unkown: ' + idToFollow
      })
    if (res.locals.user.id == idToFollow)
      return res.status(403).json({
        message: 'You can\'t follow yourself !'
      })
    if (isFollowing)
      return res.status(403).json({
        message: 'You already are following ' + userToFollow.username
      })
    await models.Follow.create({
      personBeingFollowed: idToFollow,
      personFollowing: res.locals.user.id
    })
    res.status(200).json({
      message: 'You are now following ' + userToFollow.username
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error
    })
  }
}

module.exports.unfollow = async (req, res) => {
  try {
    const idToFollow = req.params.id
    const userToFollow = await models.User.findOne({
      where: {
        id: idToFollow
      }
    })
    const isFollowing = await models.Follow.findOne({
      where: {
        personBeingFollowed: idToFollow,
        personFollowing: res.locals.user.id
      }
    })
    if (!userToFollow)
      return res.status(404).json({
        message: 'User unkown: ' + idToFollow
      })
    if (res.locals.user.id == idToFollow)
      return res.status(403).json({
        message: 'You can\'t unfollow yourself !'
      })
    if (!isFollowing)
      return res.status(403).json({
        message: 'You aren\'t following ' + userToFollow.username
      })
    await isFollowing.destroy()
    res.status(200).json({
      message: 'You are now unfollowing ' + userToFollow.username
    })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
}

module.exports.getFollow = async (req, res) => {
  let userFollowing
  try {
    userFollowing = await models.Follow.findAll({
      where: {
        personFollowing: req.params.id
      }
    })
    res.status(200)
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error
    })
  }
  if (!userFollowing)
    return res.status(404).json({
      'message': 'User not found'
    })
  try {
    userFollower = await models.Follow.findAll({
      where: {
        personBeingFollowed: req.params.id
      }
    })
    res.status(200).json({
      userFollowing,
      userFollower
    })
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
  if (!userFollower)
    return res.status(404).json({
      'message': 'User not found'
    })
}
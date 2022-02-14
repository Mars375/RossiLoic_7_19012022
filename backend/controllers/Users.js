const models = require('../models')
const zxcvbn = require('zxcvbn')
const bcrypt = require('bcrypt')

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await models.User.findAll({
      attributes:[
          'username',
          'bio',
          'firstname',
          'lastname',
          'picture'
        ]
    })
    if (!users.length)
      return res.status(404).json({
        message: 'Users not found'
      })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

module.exports.getOneUser = async (req, res) => {
  try {
    const user = await models.User.findOne({
      attributes:[
        'username',
        'bio',
        'firstname',
        'lastname',
        'picture'
      ],
      where: {
        id: req.params.id
      },
    })
    if (!user)
      return res.status(404).json({
        message: 'User unkown : ' + req.params.id
      })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

module.exports.updateUser = async (req, res) => {
  try {
    const {
      email,
      username,
      lastname,
      firstname,
      password,
      bio,
      picture,
      isAdmin
    } = req.body
    const user = await models.User.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!user)
      return res.status(404).json({
        message: 'User not found'
      })
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
    user.set ({
      bio: bio || user.bio,
      usename: username || user.username,
      email: email || user.email,
      lastname: lastname || user.lastname,
      firstname: firstname || user.firstname,
      picture: picture || user.picture
    })
    await user.save()
    res.status(200).json({
      message: 'Your profil is update !'
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

module.exports.deleteUser = async (req, res) => {
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
    res.status(200).json({
      message: "Successfully deleted !"
    })
  } catch (error) {
    res.status(500).json({
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
        following: idToFollow,
        followers: res.locals.user.id
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
    await Follow.create({
      followers: res.locals.user.id,
      following: idToFollow
    })
    res.status(200).json({
      message: 'You are now following ' + userToFollow.username
    })
  } catch (error) {
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
        following: idToFollow,
        followers: res.locals.user.id
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
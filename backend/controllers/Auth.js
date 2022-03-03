const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const zxcvbn = require('zxcvbn')
const CryptoJS = require('crypto-js')
require('dotenv').config()

const models = require('../models')

const createToken = (id) => {
  return jwt.sign({
    id
  }, process.env.SECRET_TOKEN, {
    expiresIn: '24h'
  })
}

module.exports.signup = async (req, res, next) => {
  const {
    email,
    username,
    lastname,
    firstname,
    password,
    bio,
  } = req.body
  if (email == null || username == null || password == null) {
    return res.status(400).json({
      'error': 'missing parameters'
    });
  }
  const passwordSecure = zxcvbn(password, [firstname, lastname, email, username])
  if (passwordSecure.score >= 2 || password.toLowerCase().includes('groupomania')) {
    try {
      const hash = await bcrypt.hash(password, 10)
      var newUser = await models.User.create({
        email,
        password: hash,
        username,
        lastname,
        firstname,
        bio,
      })
      res.status(201).json({
        'userId': newUser.id,
        message: 'User created !'
      })
    } catch (error) {
      console.log(error);
      res.status(403).json({
        error
      })
    }
  } else {
    return res.status(401).json({
      message: passwordSecure.feedback.warning + "\n" + passwordSecure.feedback.suggestions
    })
  }
}

module.exports.login = async (req, res, next) => {
  const {
    email,
    password
  } = req.body
  try {
    const user = await models.User.findOne({
      where: {
        email
      }
    })
    if (!user)
      return res.status(404).json({
        message: 'Wrong Mail or Password !'
      })
    const userPassword = await bcrypt.compare(password, user.password)
    if (!userPassword)
      return res.status(401).json({
        message: 'Wrong Mail or Password !'
      })
    const token = createToken(user.id)
    res.cookie('jwt', token, {
      maxAge: 24 * 60 * 60 * 1000 * 2
    })
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        admin: user.isAdmin,
        picture: user.picture
      },
      message: "You are now logged in !"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error
    })
  }
}

module.exports.logout = async (req, res) => {
  res.cookie('jwt', '', {
    maxAge: 0
  })
  res.redirect(200, '/')
}
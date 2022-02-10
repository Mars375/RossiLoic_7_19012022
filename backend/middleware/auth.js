const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')
require('dotenv').config()

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (error, decodedToken) => {
      if (error) {
        res.locals.user = null
        res.cookie('jwt', '', {
          maxAge: 0
        })
      } else {
        let user = await UserModel.findOne({
          where: {
            id: decodedToken.id
          },
          attributes: {
            excludes: ['password']
          }
        })
        if (!user) {
          res.locals.user = null
          res.cookie('jwt', '', {
            maxAge: 0
          })
          return res.status(404).json({
            message: "User not found"
          })
        }
        res.locals.user = user
        next()
      }
    })
  } else {
    res.status(403).json({
      message: "You are not log !"
    })
  }
}

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (error, decodedToken) => {
      if (error) {
        console.log(error);
      } else {
        console.log(decodedToken.id);
        next()
      }
    })
  } else {
    console.log('No token');
  }
}

module.exports.isUser = async (req, res, next) => {
  try {
    const user = res.locals.user
    if (user.isAdmin)
      return next()
    const userPofil = await UserModel.findOne({
      where: {
        id: req.params.id
      },
      attributes: {
        excludes: ['password']
      }
    })
    if (!userPofil) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    if (userPofil.id != user.id) {
      return res.status(403).json({
        message: "You are not " + userPofil.username
      })
    }
    next()
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}
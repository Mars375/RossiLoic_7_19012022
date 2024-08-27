const jwt = require('jsonwebtoken')
const models = require('../models')
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
        res.status(401).json({
          message: 'Unauthorized'
        })
      } else {
        let user = await models.User.findOne({
          where: {
            id: decodedToken.id
          },
          attributes: {
            exclude: ['password']
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
        res.cookie('jwt', '', {
          maxAge: 0
        })
        res.status(401).json({
          isAuthenticated: false,
          message: 'Invalid token'
        })
      } else {
        res.locals.user = decodedToken
        res.status(200).json({
          isAuthenticated: true,
          user: decodedToken
        })
      }
    })
  } else {
    res.status(200).json({
      isAuthenticated: false,
      message: 'No token provided'
    })
  }
}

module.exports.isUser = async (req, res, next) => {
  try {
    if (res.locals.user.isAdmin) return next()
    const userProfil = await models.User.findOne({
      where: {
        id: req.params.id
      },
      attributes: {
        exclude: ['password']
      }
    })
    if (!userProfil) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    if (userProfil.id != res.locals.user.id) {
      return res.status(403).json({
        message: "You are not " + userProfil.username
      })
    }
    next()
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}
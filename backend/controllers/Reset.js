const models = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const zxcvbn = require('zxcvbn')
const sendEmail = require('../utils/sendEmail')

module.exports.sendEmail = async (req, res) => {
  const {
    email
  } = req.body
  if (email == null) {
    return res.status(400).json({
      'error': 'missing parameters'
    });
  }
  try {
    const user = await models.User.findOne({
      where: {
        email: email,
      }
    })
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    let token = jwt.sign({
      id: user.id
    }, process.env.SECRET_TOKEN, {
      expiresIn: '1h'
    })
    token = token.replace(/\./g, '!')
    const url = `${process.env.URL}/reset/${token}`
    console.log(url);
    sendEmail(email, url)
    res.status(200).json({
      message: 'Email sent'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    })
  }
}

module.exports.reset = async (req, res) => {
  const {
    password
  } = req.body
  if (password == null) {
    return res.status(400).json({
      'error': 'missing parameters'
    });
  }
  console.log(password);
  try {
    const token = req.params.token.replace(/!/g, '.')
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
    const user = await models.User.findOne({
      where: {
        id: decoded.id
      }
    })
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    const hash = await bcrypt.hash(password, 10)
    await user.update({
      password: hash,
    })
    res.status(200).json({
      message: 'Password updated'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    })
  }
}

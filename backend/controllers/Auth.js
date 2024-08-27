const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const zxcvbn = require('zxcvbn');
require('dotenv').config();

const models = require('../models');

const createToken = (id, isAdmin) => {
  return jwt.sign({
    id,
    isAdmin
  }, process.env.SECRET_TOKEN, {
  });
};

module.exports.signup = async (req, res, next) => {
  const {
    email,
    username,
    lastname,
    firstname,
    password,
    bio,
    staySign
  } = req.body;

  if (email == null || username == null || password == null) {
    return res.status(400).json({
      'error': 'missing parameters'
    });
  }

  const user = await models.User.findOne({
    where: {
      email
    }
  });

  if (user) {
    return res.status(400).json({
      'error': 'Email already used'
    });
  }

  const passwordSecure = zxcvbn(password, [firstname, lastname, email, username]);
  if (password.toLowerCase().includes('groupomania')) {
    return res.status(401).json({
      message: 'Password must not include groupomania'
    });
  }

  if (passwordSecure.score >= 2) {
    try {
      const hash = await bcrypt.hash(password, 10);
      var newUser = await models.User.create({
        email,
        password: hash,
        username,
        lastname,
        firstname,
        bio,
        isAdmin: false,
      });

      const token = createToken(newUser.id, newUser.isAdmin);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: staySign ? 7 * 24 * 3600000 : 1 * 24 * 3600000 // 7 jours ou 1 jour
      });

      res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          admin: newUser.isAdmin,
          picture: newUser.picture,
          background: newUser.background,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
        },
        message: 'User created!'
      });
    } catch (error) {
      console.log(error);
      res.status(403).json({
        error
      });
    }
  } else {
    return res.status(401).json({
      message: passwordSecure.feedback.warning + "\n" + passwordSecure.feedback.suggestions
    });
  }
};

module.exports.login = async (req, res, next) => {
  const {
    email,
    password,
    staySign,
  } = req.body;

  try {
    const user = await models.User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(401).json({
        message: 'Wrong Mail or Password!'
      });
    }

    const userPassword = await bcrypt.compare(password, user.password);
    if (!userPassword) {
      return res.status(401).json({
        message: 'Wrong Mail or Password!'
      });
    }

    const token = createToken(user.id, user.isAdmin);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: staySign ? 7 * 24 * 3600000 : 1 * 24 * 3600000 // 7 jours ou 1 jour
    });

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        admin: user.isAdmin,
        picture: user.picture,
        background: user.background,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      message: "You are now logged in!"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    });
  }
};

module.exports.logout = async (req, res) => {
  res.cookie('jwt', '', {
    maxAge: 0
  });
  res.redirect(200, '/');
};
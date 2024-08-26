const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/Auth')
const { checkUser } = require('../middleware/auth')

router.post('/signup', authCtrl.signup)
router.post('/login', authCtrl.login)
router.post('/logout', authCtrl.logout)
router.post('/google', authCtrl.loginGoogle)
router.get('/check-auth', checkUser, (req, res) => {
  res.status(200).json({ isLoggedIn: true, user: res.locals.user });
});

module.exports = router
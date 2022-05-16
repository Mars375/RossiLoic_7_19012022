const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/Auth')

router.post('/signup', authCtrl.signup)
router.post('/login', authCtrl.login)
router.post('/logout', authCtrl.logout)
router.post('/google', authCtrl.loginGoogle)

module.exports = router
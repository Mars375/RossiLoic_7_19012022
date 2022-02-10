const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/Auth')

router.post('/signup', authCtrl.signup)
router.post('/login', authCtrl.login)
router.get('/logout', authCtrl.logout)

module.exports = router
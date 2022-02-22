const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/Users')
const { checkUser, isUser } = require('../middleware/auth')

router.get('/', userCtrl.getAllUsers )
router.get('/:id', userCtrl.getOneUser )
router.put('/:id', checkUser, isUser, userCtrl.updateUser)
router.delete('/:id', checkUser, isUser, userCtrl.deleteUser)

router.get('/follow/:id', userCtrl.getFollow)
router.patch('/follow/:id', checkUser, userCtrl.follow)
router.patch('/unfollow/:id', checkUser, userCtrl.unfollow)

module.exports = router
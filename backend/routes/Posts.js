const express = require('express')
const router = express.Router()
const postCtrl = require('../controllers/Posts')
const { checkUser, isUser } = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.get('/', postCtrl.getAllPosts)
router.get('/:id', postCtrl.getOnePost)
router.post('/', checkUser, multer, postCtrl.createPost)

// router.get('/category/:category', postCtrl.getAllPostCategory)
// router.put('/:id', checkUser, isUser, postCtrl.updatePost)
// router.delete('/:id', checkUser, isUser, postCtrl.deletePost)

module.exports = router
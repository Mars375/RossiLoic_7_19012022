const express = require('express')
const router = express.Router()
const postCtrl = require('../controllers/Posts')
const likeCtrl = require('../controllers/Likes')
const { checkUser } = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.get('/', postCtrl.getAllPosts)
router.get('/user/:user_id', postCtrl.getPostOfUser)
router.get('/category/:category', postCtrl.getAllPostByCategory)
router.get('/:id', postCtrl.getOnePost)

router.post('/', checkUser, multer, postCtrl.createPost)

router.put('/:id', checkUser, multer, postCtrl.updatePost)

router.delete('/:id', checkUser, postCtrl.deletePost)

//Like
router.post('/:postId/like', checkUser, likeCtrl.likePost)
router.get('/:postId/like', likeCtrl.getLike)


module.exports = router
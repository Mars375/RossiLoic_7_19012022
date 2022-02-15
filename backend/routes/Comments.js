const express = require("express")
const router = express.Router()

const { checkUser } = require('../middleware/auth')
const commentCtrl = require("../controllers/Comments")

//Comments
router.post("/:postId/comment", checkUser, commentCtrl.createComment)
router.delete("/:postId/comment/:commentId", checkUser, commentCtrl.deleteComment)
router.put("/:postId/comment/:commentId", checkUser, commentCtrl.updateComment)

module.exports = router
const express = require('express')
const router = express.Router()
const resetCtrl = require('../controllers/Reset')

router.post('/', resetCtrl.sendEmail)
router.post('/:token', resetCtrl.reset)

module.exports = router
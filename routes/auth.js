const express = require('express')
const router = express.Router()

const signup = require("../routes/singup");
const login = require('../routes/login')
const google = require('../routes/google')
const github = require('../routes/github')
const forgetPassword = require('../routes/forgetPassword')
const changePassword = require('../routes/changePassword')

router.post('/signup', signup);
router.post('/login', login)
router.post('/google', google)
router.post('/github', github)
// router.post('/forgot-password', forgetPassword)
// router.post('/reset-password', verifyToken, changePassword)

module.exports = router

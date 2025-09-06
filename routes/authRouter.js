const express = require('express')
const router = express.Router()

const google = require('./google')
const { signup, login, logout } = require('../controller/authController')

router.post('/signup', signup);
router.post('/login', login);
router.post("/logout",logout);
router.post('/google', google);

module.exports = router

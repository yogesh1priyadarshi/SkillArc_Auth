const express = require('express')
const router = express.Router()

const google = require('./google')
const { signup, login } = require('../controller/authController')

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', google);

module.exports = router

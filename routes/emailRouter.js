const express = require("express");
const { sendOTP } = require("../utils/email");
const { sendOTPForEmailVarification } = require("../controller/emailContrller");

const router = express.Router();

router.post("/sendOTP",sendOTPForEmailVarification);


module.exports = router;
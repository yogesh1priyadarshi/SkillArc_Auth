const express = require("express");
const { sendOTP } = require("../utils/email");
const { sendOTPForEmailVarification, verifyOTPForEmailVarification } = require("../controller/emailContrller");

const router = express.Router();

router.post("/sendOTP",sendOTPForEmailVarification);

router.post("/verifyOTP",verifyOTPForEmailVarification);



module.exports = router;
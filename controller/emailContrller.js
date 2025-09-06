const crypto = require("crypto");
const User = require("../models/authModel");
const { sendOTP } = require("../utils/email");
const { default: axios } = require("axios");
const publishUserCreated = require("../utils/rabbitQM");

const sendOTPForEmailVarification = async (req, res) => {
  try {
    const { email } = req?.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email is not provided." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user is not available in database.",
      });
    }
    const OTP = crypto.randomInt(100000, 1000000).toString();

    const hashedOTP = crypto.createHash("sha256").update(OTP).digest("hex");

    user.OTP = {
      code: hashedOTP,
      expires: Date.now() + Number(process.env.OTP_EXPIRE_MINUTES) * 60 * 1000,
    };

    await user.save();

    const result = await sendOTP(user?.email, OTP);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Could not send verification email",
      });
    }

    return res.json({
      success: true,
      message: " Please check your email for the OTP.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Could not send verification email",
    });
  }
};

const verifyOTPForEmailVarification = async (req, res) => {
  try {
    const { otp, email } = req?.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email is not provided." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user is not available in database.",
      });
    }
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Check if expired
    if (user?.OTP?.expires < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Compare hash
    if (user?.OTP?.code !== hashedOTP) {
       res.status(400).json({ error: "Invalid OTP" });
    }
    await user.emailVerification(true);

   // const update = await axios.post("http://localhost:2001/api/user/createAccount",{userId:user?._id,email:user?.email});
    // ✅ OTP is valid
    // Publish event to RabbitMQ
    await publishUserCreated({
      id: user._id,
      email: user.email,
      name: user.fullName,
    });

    // console.log("User microservice response:", update.data);
    // console.log(update);
    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "something went error",
    });
  }
};

module.exports = { sendOTPForEmailVarification, verifyOTPForEmailVarification };

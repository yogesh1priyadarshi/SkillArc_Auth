const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';

    console.log("👤 Login attempt:", { email, phoneNumber, password });

    // Allow email or phoneNumber -only login - modify the check to require only email
    if (!email && !phoneNumber) {
      console.error("❌ Missing required email/phoneNumber for login");
      return res.status(400).json({
        status: "error",
        message: "Email or Phone number is required for login",
      });
    }

    // Also check if the email exists
    let user=null;
    if (email) {
       user = await User.findOne({ email });
    }else{
       user = await User.findOne({phoneNumber});
    }

    // If no user exists, create a new one
    if(!user){
       console.error("❌  email/phoneNumber is not found!!!");
      return res.status(400).json({
        status: "error",
        message: "email/phoneNumber is not found!!!",
      });
    }
    
    // password check;
    const passwordHash = user?.password;
    const isMatch = await bcrypt.compare(password,passwordHash);
    if(!isMatch){
       console.error("❌  password is not correct!!!");
      return res.status(401).json({
        status: "error",
        message: "password is not correct!!!",
      });
    }
   

    // Generate JWT token for authentication
    console.log("🔑 Generating token for user:", user._id);
     const token = generateAccessToken(user,true);
     const refreshToken = generateRefreshToken(user);
     console.log("token is:",token, "\nfresh is ", refreshToken);

    // Add last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Send successful response with token
    console.log("✅ Login successful for user. userId=>:", user._id);
    return res.status(200).json({
      status: "success",
      data: {
        token,
        refreshToken,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImg: user.profileImg,
          authProvider: user.authProvider || "email",
        },
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

module.exports = login;

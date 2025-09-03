const User = require("../models/authModel");
const bcrypt = require('bcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");
const sendEmail = require("../utils/email");
const refreshTokenModel = require("../models/refreshTokenModel");

const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
    } = req?.body;

    if(!fullName || !email || !password){
      return res.status(400).json({ success: false, message: "all fields are required."});
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    const saltRounds = parseInt(process.env.SALT );
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email,
      password:passwordHash,
    });
    const userSaved = await user.save();
    return res.status(200).json({
      successful:true,
      message:"user saved!!",
      user:{
        userId: userSaved?._id,
        fullName: userSaved?.fullName,
        email: userSaved?.email,
      }
    });

  } catch (err) {
  if (err.code === 11000) { // Mongo duplicate key error
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }
  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}};

const login = async (req, res) => {
  try {
    const { email, password } = req?.body;
    if (!email ) {
      return res.status(400).json({
        successful:false,
        message: "Email   is required for login",
      });
    }
    // Also check if the email exists
    const user = await User.findOne({ email });
    // If no user exists 
    if(!user){
      return res.status(400).json({
        successful:false,       
        message: "email is not found!!!",
      });
    }
    
    // password check;
    const passwordHash = user?.password;
    const isMatch = await bcrypt.compare(password,passwordHash);
    if(!isMatch){
      return res.status(401).json({
        successful:false,       
        message: "password is not correct!!!",
      });
    }
   
    // Generate JWT token for authentication

  const accessToken = generateAccessToken(user, true);
  const refreshToken = await generateRefreshToken(user);
    // Add last login timestamp
    await user.updateLastLogin();

    // Send successful response with token
    return res.status(200).json({
      successful:true,
      data: {
        accessToken,
        refreshToken,
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      successful:false, 
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

async function logout(req, res) {
  try{
    const { refreshToken } = req.body;
  if (refreshToken) {
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await refreshTokenModel.deleteOne({ tokenHash });
  }
  res.status(200).json({ success:true, message: "Logged out" });

  }catch(err){
    res.status(500).json({
      success:false,
      message:"something went wrong"
    })

  }
  
}


module.exports = {signup, login, logout};

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to check Access Token
const authCheckAccess = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No Access Token provided!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    if (!decoded) {
      return res.status(403).json({ message: "Invalid Access Token!" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Access token error:", err.message);
    return res.status(401).json({ message: "Unauthorized (Access Token)" });
  }
};

// Middleware to check Refresh Token
const authCheckRefresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken; // Usually stored in HttpOnly cookie
    if (!refreshToken) {
      return res.status(401).json({ message: "No Refresh Token provided!" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    if (!decoded) {
      return res.status(403).json({ message: "Invalid Refresh Token!" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Refresh token error:", err.message);
    return res.status(401).json({ message: "Unauthorized (Refresh Token)" });
  }
};

module.exports = { authCheckAccess, authCheckRefresh};

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RefreshToken = require("../models/refreshTokenModel");

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Generate short-lived Access Token
function generateAccessToken(user, isFresh = true) {
  return jwt.sign(
    { id: user?._id, fresh: isFresh },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

// Generate Refresh Token (random string, then hash & save in DB)
async function generateRefreshToken(user) {
  const refreshTokenValue = crypto.randomBytes(40).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(refreshTokenValue).digest("hex");

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt
  });

  return refreshTokenValue; // return plain token to client
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
};

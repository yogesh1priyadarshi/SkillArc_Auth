const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';

// Generate access token (fresh = true or false)
function generateAccessToken(user, isFresh = true) {
  return jwt.sign(
    {
      id: user.id,
      fresh: isFresh, // custom claim
    },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
}

// Generate refresh token (only to get new access tokens)
function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
    },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};

const crypto = require("crypto");
const RefreshToken = require("./models/RefreshToken");

async function refresh(req, res) {
    try{
         const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "No refresh token" });

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const stored = await RefreshToken.findOne({ tokenHash });
  if (!stored) return res.status(403).json({ error: "Invalid refresh token" });

  // Check expiry
  if (stored.expiresAt < new Date()) {
    await stored.deleteOne();
    return res.status(403).json({ error: "Expired refresh token" });
  }

  // ✅ Token valid → issue new pair
  const newAccessToken = generateAccessToken({ _id: stored.userId }, false);
  const newRefreshToken = await generateRefreshToken({ _id: stored.userId });

  // Delete old refresh token (rotation)
  await stored.deleteOne();

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    }catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"something went wrong!"
        })
    }
}

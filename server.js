require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const logger = require("./utils/logger");
const { connectDB } = require("./config/configDB");

const app = express();
app.use(express.json());

// Basic request logging - before any middleware
app.use((req, res, next) => {
  console.log('\n🔔 INCOMING REQUEST:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    authorization: req.headers.authorization,
    headers: {
      'content-type': req.headers['content-type'],
      authorization: req.headers.authorization ? 'Bearer ...' : 'None'
    }
  })
  next()
})

logger.info("good message!!!");

app.use("/feed",profileRoutes);
app.use("/auth", authRoutes);

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log("User service running on port " + process.env.PORT);
    });
  })
  .catch(err => console.error("Mongo error:", err));

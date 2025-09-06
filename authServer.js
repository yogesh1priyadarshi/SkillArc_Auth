require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const authRoutes = require("./routes/authRouter");
const logger = require("./utils/logger");
const { connectDB } = require("./config/configDB");
const connectRabbitMQ = require("./config/configRabbitMQ");

const app = express();
app.use(express.json());
app.use(cors());

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

app.use("/api", require("./routes/apiRouter"));

(async () => {
  await connectRabbitMQ();
})();

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log("User service running on port " + process.env.PORT);
    });
  })
  .catch(err => console.error("Mongo error:", err));

const express = require("express");
const requireFreshToken = require("../middleware/requireFreshToken");

const router = express.Router();

router.get("/profile",requireFreshToken, async(req, res)=>{
// add middle ware to handle fresh token; to varify token;
console.log("profile");
    res.send("ram is good person!!! "); 
});

module.exports = router;
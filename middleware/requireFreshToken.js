const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireFreshToken = async(req, res, next) =>{
    try{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearers ")){
        return res.send("No Token!!!"); 
    }
    const token = authHeader.split(" ")[1];
    const ObjectId = jwt.verify(token,process.env.ACCESS_SECRET);
    if(!ObjectId){
        return res.send("not valid Token!!!"); 
    }
    const _id = ObjectId.id;
    const user = await User.findById(_id);
    req.user = user;
    next();
    }catch(err){
        console.error(err);
    }
}
module.exports = requireFreshToken;
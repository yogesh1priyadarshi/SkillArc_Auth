const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    fullName:{
      type:String,
      required:true,
    },
    email: {
      type: String,
      required:true,
      unique:true,
    },
    password:{
      type:String,
      required:true,
    },
    OTP:{
      type: { }                   
    },
    lastLogin:{
      type:Date,
      default: new Date(),
    }
  },
  { timestamps: true }, // Automatically adds createdAt & updatedAt fields
)

module.exports = mongoose.model('User', UserSchema)

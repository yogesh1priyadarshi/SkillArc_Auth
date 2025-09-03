const mongoose = require('mongoose')

const authSchema = new mongoose.Schema(
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
    isEmailVerified:{
      type: Boolean,
      default: false,
    },
      authProvider: {
      type: String,
      enum: ['Email', 'Google'],
      default: 'Email',
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

authSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();   // set to current time
  await this.save();
  return this;
};
authSchema.methods.emailVerification = async function (value) {
  this.isEmailVerified = value   // set to current time
  await this.save();
  return this;
};

module.exports = mongoose.model('Auth', authSchema)

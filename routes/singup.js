const User = require("../models/User");
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      phoneNumber,
      password,
    } = req.body;
    console.log(firstName, lastName, dateOfBirth, email, phoneNumber, password);
    const saltRounds = parseInt(process.env.SALT || '10');
    const salt = await bcrypt.genSalt(saltRounds);
     const passwordHash = await bcrypt.hash(password, salt);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      dateOfBirth,
      email,
      phoneNumber,
      password:passwordHash,
    });
    const uploadUser = await user.save();
     console.log('✅ Singup successful for user:', uploadUser );
    return res.status(200).json({
      status: 'success',
        uploadUser
    });

  } catch (err) {
    console.error(err);
  }
};

module.exports = signup;

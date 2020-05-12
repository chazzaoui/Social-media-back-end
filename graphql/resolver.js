const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require('validator');

module.exports = {
  createUser: async function ({ userInput }, req) {
    const { email, password, name } = userInput;
    const errors = [];
    if (!validator.isEmail(email)){
      errors.push({message: 'E-mail is invalid'})
    }
    if (validator.isEmpty(password) || !validator.isLength(password, {min: 5})){
      errors.push({message: 'Password too short'})
    }
    if (errors.length > 0){
      const error = new Error('Invalid input.')
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists!");
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
        email,
        name,
        password: hashedPw,
      });
      const createdUser = await user.save();
      return {...createdUser._doc, _id: createdUser._id.toString()}
  },
};

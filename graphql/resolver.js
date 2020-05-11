const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const { email, password, name } = userInput;
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

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
//const User = require("../models/user.model");
const { SECRET } = require("../config");
const User = require('../models/user.model')


const userLogin = async (req, res) => {
  let { username, password } = req.body;
  // First Check if the username is in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "Username is not found. Invalid login credentials.",
      success: false
    });
  }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        // email: user.email
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      changeProfile: user.changeProfile,
      token: ` ${token}`,
      expiresIn: 168
    };

    return res.status(200).json({
      ...result,
      message: "You are now logged in.",
      success: true
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
      success: false
    });
  }
};

const validateUsername = async username => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();

const serializeUser = user => {
  return {
    username: user.username,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt
  };
};

module.exports = {
  userAuth,
  checkRole,
  userLogin,
  serializeUser
};

require("dotenv").config();
const User = require("../Models/UserService");
const jwt = require("jsonwebtoken");
const { logger } = require("../logger");

const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set. The application will not run without it.");
}

/**
 * Handle errors during authentication operations.
 * @param {Error} err - The error object.
 * @returns {Object} The errors related to email and password.
 */
const handleErrors = (err) => {
  logger.error(err.message, err.code);
  const errors = { email: "", password: "" };

  if (err.message.includes("incorrect email")) {
    errors.email = "Incorrect email or password";
  }

  if (err.message.includes("incorrect password")) {
    errors.password = "Incorrect email or password";
  }

  if (err.code === 11000) {
    errors.email = "That email is already in use";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  // Handle specific error cases
  if (err instanceof jwt.JsonWebTokenError) {
    errors.token = "Invalid token";
  }

  return errors;
};

const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '3d'; 
const createToken = (id) => {
  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });

  // Convert TOKEN_EXPIRATION to milliseconds
  let maxAge;
  if (TOKEN_EXPIRATION.endsWith('d')) {
    maxAge = parseInt(TOKEN_EXPIRATION.slice(0, -1)) * 24 * 60 * 60 * 1000;
  } else {
    maxAge = parseInt(TOKEN_EXPIRATION) * 1000; // Assumes seconds if no 'd' present
  }

  return { token, maxAge };
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const { token, maxAge } = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge });
    logger.info(`User signup successful.`);
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    if (err.code === 11000) {
      res.status(409).json({ errors });
      return;
    }
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const { token, maxAge } = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge });
    logger.info(`User login successful.`);
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    if (err.code === 11000) {
      res.status(409).json({ errors });
      return;
    }
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = async (req, res) => {
  logger.info("User logged out successfully.");
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

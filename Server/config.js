module.exports = {
  // Secret for JSON Web Tokens
  JWT_SECRET: process.env.JWT_SECRET,

  // MongoDB connection string
  MONGODB_URI: process.env.MONGODB_URI,

  // Session secret
  SESSION_SECRET: process.env.SESSION_SECRET,

  // Base URL of the API
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,

  NODE_ENV: process.env.NODE_ENV,
};
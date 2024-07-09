const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    // If token verification fails (e.g., expired or invalid token), handle the error here
    console.error("Token verification failed:", error.message);
    return null;
  }
};

module.exports = { generateToken, verifyToken };

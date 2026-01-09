const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Auth Error:", err.name);

    // JWT error
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    // Mongoose error
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Fallback
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = authMiddleware;
// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// Middleware to verify if the user is authenticated and is an admin
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has the admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Attach the user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or expired tokens
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyAdmin };

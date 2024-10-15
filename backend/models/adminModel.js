// backend/models/adminModel.js

const bcrypt = require("bcryptjs");

// Hardcoded admin credentials (for demonstration purposes)
// In a production environment, use a database to store user credentials

const adminUser = {
  email: "admin@example.com",
  passwordHash: bcrypt.hashSync("adminpassword", 10), // Hash the password
};

// Function to find an admin by email
function findAdminByEmail(email) {
  if (email === adminUser.email) {
    return adminUser;
  }
  return null;
}

module.exports = { findAdminByEmail };

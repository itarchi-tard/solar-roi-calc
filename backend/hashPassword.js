const bcrypt = require("bcryptjs");

// Admin's plain-text password
const password = "Notpermitted"; // Replace with the password you want

// Hashing the password
const salt = bcrypt.genSaltSync(10); // Generate salt
const hashedPassword = bcrypt.hashSync(password, salt); // Hash password

console.log("Hashed Password: ", hashedPassword);

// models/userModel.js

const bcrypt = require("bcrypt");

const users = [
  {
    email: "admin@example.com",
    password: bcrypt.hashSync("adminpassword", 10), // Hash the password
    role: "admin",
  },
  {
    email: "user@example.com",
    password: bcrypt.hashSync("userpassword", 10), // Hash the password
    role: "user",
  },
];

const findUserByEmail = (email) => users.find((user) => user.email === email);

module.exports = { findUserByEmail };

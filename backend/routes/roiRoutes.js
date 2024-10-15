// backend/routes/roiRoutes.js

const express = require("express");
const { calculateSolarROI } = require("../controllers/roiController");
const { findAdminByEmail } = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { verifyAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Route for calculating the solar ROI (accessible to all users)
router.post("/calculate-solar-roi", calculateSolarROI);

// Admin login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find admin by email
  const admin = findAdminByEmail(email);

  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Verify the password
  const passwordIsValid = bcrypt.compareSync(password, admin.passwordHash);

  if (!passwordIsValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate a JWT token with the admin role
  const token = jwt.sign(
    { email: admin.email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Return the token to the client
  return res.json({ token });
});

// Protected admin routes

// Route to add a new generator
router.post("/generators", verifyAdmin, (req, res) => {
  // Logic to add a new generator
  // Example:
  // const { size, cost, fuelConsumption } = req.body;
  // Save to database...
  res.json({ message: "New generator added successfully" });
});

// Route to update a generator
router.put("/generators/:id", verifyAdmin, (req, res) => {
  // Logic to update generator details by ID
  // Example:
  // const generatorId = req.params.id;
  // const updatedData = req.body;
  // Update in database...
  res.json({
    message: `Generator with ID ${req.params.id} updated successfully`,
  });
});

// Route to delete a generator
router.delete("/generators/:id", verifyAdmin, (req, res) => {
  // Logic to delete a generator by ID
  // Example:
  // const generatorId = req.params.id;
  // Delete from database...
  res.json({
    message: `Generator with ID ${req.params.id} deleted successfully`,
  });
});

module.exports = router;

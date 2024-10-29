const express = require("express");
const { calculateSolarROI } = require("../controllers/roiController");
const { findAdminByEmail } = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { verifyAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const pool = require("../config/db"); // Make sure pool is imported correctly

// Route for calculating the solar ROI (accessible to all users)
router.post("/calculate-solar-roi", calculateSolarROI);

// Admin login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    if (admin.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const foundAdmin = admin.rows[0];
    const passwordIsValid = bcrypt.compareSync(
      password,
      foundAdmin.password_hash
    );

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: foundAdmin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;

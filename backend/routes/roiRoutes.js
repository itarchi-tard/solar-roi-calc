// routes/roiRoutes.js

const express = require("express");
const { calculateSolarROI } = require("../controllers/roiController"); // Make sure this is correctly imported

const router = express.Router();

// Route for calculating the solar ROI
router.post("/calculate-solar-roi", calculateSolarROI); // Ensure calculateSolarROI is defined

module.exports = router;

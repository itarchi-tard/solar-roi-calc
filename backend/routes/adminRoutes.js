// backend/routes/adminRoutes.js

const express = require("express");
const { verifyAdmin } = require("../middleware/authMiddleware"); // Import middleware
const {
  getAllGenerators,
  createGenerator,
  updateGenerator,
  deleteGenerator,
} = require("../controllers/adminController");
const router = express.Router();

// Admin routes protected by the verifyAdmin middleware
router.get("/generators", verifyAdmin, getAllGenerators);
router.post("/generators", verifyAdmin, createGenerator);
router.put("/generators/:id", verifyAdmin, updateGenerator);
router.delete("/generators/:id", verifyAdmin, deleteGenerator);

module.exports = router;

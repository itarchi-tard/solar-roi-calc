// backend/routes/roiRoutes.js
const express = require("express");
const {
  getAllGenerators,
  addGenerator,
  updateGenerator,
  deleteGenerator,
  getAllInverters,
  addInverter,
  updateInverter,
  deleteInverter,
  getAllSolarChargeControllers,
  addSolarChargeController,
  updateSolarChargeController,
  deleteSolarChargeController,
} = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Generator Routes
router.get("/generators", verifyAdmin, getAllGenerators);
router.post("/generators", verifyAdmin, addGenerator);
router.put("/generators/:id", verifyAdmin, updateGenerator);
router.delete("/generators/:id", verifyAdmin, deleteGenerator);

// Inverter Routes
router.get("/inverters", verifyAdmin, getAllInverters);
router.post("/inverters", verifyAdmin, addInverter);
router.put("/inverters/:id", verifyAdmin, updateInverter);
router.delete("/inverters/:id", verifyAdmin, deleteInverter);

// Solar Charge Controller Routes
router.get(
  "/solar_charge_controllers",
  verifyAdmin,
  getAllSolarChargeControllers
);
router.post("/solar_charge_controllers", verifyAdmin, addSolarChargeController);
router.put(
  "/solar_charge_controllers/:id",
  verifyAdmin,
  updateSolarChargeController
);
router.delete(
  "/solar_charge_controllers/:id",
  verifyAdmin,
  deleteSolarChargeController
);

module.exports = router;

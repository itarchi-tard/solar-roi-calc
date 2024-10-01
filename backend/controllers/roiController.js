// controllers/roiController.js

const { getNearestGenerator } = require("../models/generatorModel");
const { getInverterBySize } = require("../models/inverterModel");
const { getControllerByAmperage } = require("../models/controllerModel");

const BASE_BATTERY_COST = 145000;
const BASE_BATTERY_NUMBER = 2;
const BATTERY_CAPACITY = 150; // Ah
const BATTERY_VOLTAGE = 24; // V (Inverter voltage)
const DEPTH_OF_DISCHARGE = 0.8;
const EFFICIENCY = 0.8;
const PANEL_WATTAGE = 300; // Watts per solar panel
const PANEL_COST = 120000; // Cost of one solar panel
const SOLAR_LOSS_FACTOR = 1.3; // 30% operational losses
const SUN_PEAK_HOURS = 4; // Peak sun hours
const FUEL_PRICE_PER_LITER = 700; // Naira per liter
const MAX_LOAD_CAPACITY = 20000; // 20 kW cap

// Function to calculate the inverter size
function calculateInverterSize(totalLoad) {
  return 2 * totalLoad;
}

// Battery calculation
function calculateTotalBatteries(totalLoad, userBackupTime) {
  let totalBatteryNum = BASE_BATTERY_NUMBER;

  // If the user's backup time is less than 4 hours, set total batteries to 0
  if (userBackupTime < 4) {
    return { totalBatteryNum: 0, totalBatteryCost: 0 };
  }

  // Base backup time calculation
  const baseBackupTime =
    (BATTERY_VOLTAGE * BATTERY_CAPACITY * DEPTH_OF_DISCHARGE * EFFICIENCY) /
    totalLoad;

  if (userBackupTime > baseBackupTime) {
    const additionalAhNeeded =
      ((userBackupTime - baseBackupTime) * totalLoad) / (24 * 0.8 * 0.8);

    const extraBatteryPairs = Math.ceil(additionalAhNeeded / BATTERY_CAPACITY);
    const extraBatteryNum = extraBatteryPairs * 2; // Each pair has 2 batteries

    totalBatteryNum += extraBatteryNum;
  }

  const totalBatteryCost = totalBatteryNum * BASE_BATTERY_COST;
  return { totalBatteryNum, totalBatteryCost };
}

// Solar panel calculation based on batteries and load
function calculateSolarPanels(totalLoad, totalBatteryNum) {
  let totalBatteryWattHours = 0;
  let panelsToChargeBatteries = 0;

  // If there are batteries, calculate the required panels to charge them
  if (totalBatteryNum > 0) {
    totalBatteryWattHours =
      (totalBatteryNum / 2) * BATTERY_CAPACITY * BATTERY_VOLTAGE;

    // Total battery wattage to charge
    const totalRequiredBatteryWattage = totalBatteryWattHours / SUN_PEAK_HOURS;

    // Add 30% operational losses
    panelsToChargeBatteries = Math.ceil(
      (totalRequiredBatteryWattage * SOLAR_LOSS_FACTOR) / PANEL_WATTAGE
    );
  }

  // Number of panels to carry the load
  const totalLoadWithLosses = totalLoad * SOLAR_LOSS_FACTOR;
  const panelsToCarryLoad = Math.ceil(totalLoadWithLosses / PANEL_WATTAGE);

  // Total panels
  const totalSolarPanels = panelsToChargeBatteries + panelsToCarryLoad;

  // Total solar panel cost
  const totalSolarPanelCost = totalSolarPanels * PANEL_COST;

  return {
    totalSolarPanels,
    panelsToChargeBatteries,
    panelsToCarryLoad,
    totalSolarPanelCost,
  };
}

// Main function to calculate solar ROI
async function calculateSolarROI(req, res) {
  try {
    const { kWhConsumed, hoursOfNepaLight, userTotalLoad, userBackupTime } =
      req.body;

    // Determine total load in watts
    let totalLoad;
    if (userTotalLoad) {
      totalLoad = Math.ceil(userTotalLoad); // Assuming userTotalLoad is already in watts, round up to nearest integer
    } else if (kWhConsumed && hoursOfNepaLight) {
      totalLoad = Math.ceil((kWhConsumed / 30 / hoursOfNepaLight) * 1000); // Convert from monthly kWh to daily watts, round up
    } else {
      return res.status(400).json({
        message:
          "Please specify either the total load or both monthly kWh consumed and hours of NEPA light.",
      });
    }

    // Check if the load exceeds 20 kW (20,000 watts)
    if (totalLoad > MAX_LOAD_CAPACITY) {
      return res.status(400).json({
        message: "Invalid Monthly Kwh consumed or Daily Hours of Grid Light",
      });
    }

    const inverterSize = Math.ceil(calculateInverterSize(totalLoad)); // Round inverter size to nearest integer
    const { totalBatteryNum, totalBatteryCost } = calculateTotalBatteries(
      totalLoad,
      userBackupTime
    );
    const {
      totalSolarPanels,
      panelsToChargeBatteries,
      panelsToCarryLoad,
      totalSolarPanelCost,
    } = calculateSolarPanels(totalLoad, totalBatteryNum);

    // Fetch inverter, generator, and controller data from the database
    const generator = await getNearestGenerator(inverterSize);
    const controller = await getControllerByAmperage(totalSolarPanels * 8.85);
    const inverter = await getInverterBySize(inverterSize);

    if (!generator || !controller || !inverter) {
      return res
        .status(400)
        .json({ message: "Error in calculation. Please check input values." });
    }

    // Costs and break-even point calculation
    const initialSolarCost =
      inverter.inverter_cost_naira +
      totalBatteryCost +
      totalSolarPanelCost + // Cost of the solar panels
      controller.solar_charge_controller_cost_naira;

    const initialGeneratorCost = generator.generator_cost_naira;

    // Corrected calculation: Multiply fuel consumption by fuel price
    const dailyOperatingCost =
      generator.fuel_consumption_per_hr * userBackupTime * FUEL_PRICE_PER_LITER;
    const monthlyOperatingGeneratorCost = dailyOperatingCost * 30;
    const yearlyOperatingGeneratorCost = dailyOperatingCost * 365;

    // Log values for debugging
    console.log(`Total Load: ${totalLoad} watts`);
    console.log(`Inverter Size: ${inverterSize} watts`);
    console.log(`Total Battery Number: ${totalBatteryNum}`);
    console.log(`Total Solar Panels: ${totalSolarPanels}`);
    console.log(`Initial Solar Cost: ${initialSolarCost}`);
    console.log(`Initial Generator Cost: ${initialGeneratorCost}`);
    console.log(
      `Monthly Operating Generator Cost: ${monthlyOperatingGeneratorCost}`
    );

    // Ensure valid break-even calculation
    if (initialSolarCost <= initialGeneratorCost) {
      return res.status(400).json({
        message:
          "Solar cost is lower than or equal to generator cost, break-even calculation not valid.",
      });
    }

    if (monthlyOperatingGeneratorCost <= 0) {
      return res.status(400).json({
        message:
          "Monthly generator operating cost is too low or zero, break-even calculation not valid.",
      });
    }

    const breakEvenMonths = Math.ceil(
      (initialSolarCost - initialGeneratorCost) / monthlyOperatingGeneratorCost
    );
    const breakEvenYears = Math.floor(breakEvenMonths / 12);
    const remainingMonths = breakEvenMonths % 12;

    return res.json({
      totalLoad,
      inverterSize,
      totalSolarPanels,
      panelsToChargeBatteries,
      panelsToCarryLoad,
      totalBatteryNum,
      totalBatteryCost,
      totalSolarPanelCost,
      initialSolarCost,
      initialGeneratorCost,
      monthlyOperatingGeneratorCost,
      yearlyOperatingGeneratorCost,
      breakEvenMonths, // Added this field
      breakEvenYears,
      remainingMonths,
    });
  } catch (error) {
    console.error("Error calculating solar ROI:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  calculateSolarROI,
};

// models/generatorModel.js

const pool = require("../config/db");

// Function to get the nearest generator by wattage
async function getNearestGenerator(wattage) {
  try {
    const roundedWattage = Math.ceil(wattage); // or Math.round(wattage) or Math.floor(wattage)
    console.log(`Fetching generator data for wattage: ${roundedWattage}`);

    const result = await pool.query(
      `SELECT * FROM generators WHERE generator_size_wattage >= $1 ORDER BY generator_size_wattage ASC LIMIT 1`,
      [roundedWattage]
    );

    if (result.rows.length === 0) {
      throw new Error("No generator found with the specified wattage");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching generator data:", err.message);
    throw new Error("Error fetching generator data");
  }
}

module.exports = {
  getNearestGenerator,
};

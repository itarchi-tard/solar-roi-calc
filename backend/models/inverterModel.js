// models/inverterModel.js

const pool = require("../config/db");

// Function to get the nearest inverter by size (in watts)
async function getInverterBySize(size) {
  try {
    const roundedSize = Math.ceil(size); // or Math.round(size) or Math.floor(size)
    console.log(`Fetching inverter data for size: ${roundedSize}`);

    const result = await pool.query(
      `SELECT * FROM inverters WHERE inverter_size_watts >= $1 ORDER BY inverter_size_watts ASC LIMIT 1`,
      [roundedSize]
    );

    if (result.rows.length === 0) {
      throw new Error("No inverter found with the specified size");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching inverter data:", err.message);
    throw new Error("Error fetching inverter data");
  }
}

module.exports = {
  getInverterBySize,
};

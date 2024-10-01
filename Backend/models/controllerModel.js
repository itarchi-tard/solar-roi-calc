// models/controllerModel.js

const pool = require("../config/db");

// Function to get the nearest solar charge controller by amperage
async function getControllerByAmperage(amperage) {
  try {
    const roundedAmperage = Math.ceil(amperage); // or Math.round(amperage) or Math.floor(amperage)
    console.log(`Fetching controller data for amperage: ${roundedAmperage}`);

    const result = await pool.query(
      `SELECT * FROM solar_charge_controllers WHERE solar_charge_controller_size_amperes >= $1 ORDER BY solar_charge_controller_size_amperes ASC LIMIT 1`,
      [roundedAmperage]
    );

    if (result.rows.length === 0) {
      throw new Error("No controller found with the specified amperage");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching controller data:", err.message);
    throw new Error("Error fetching controller data");
  }
}

module.exports = {
  getControllerByAmperage,
};

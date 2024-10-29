// backend/controllers/adminController.js
const pool = require("../config/db");

// Generators CRUD Functions
const getAllGenerators = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM generators");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching generators" });
  }
};
console.log("Fetching generators");

const addGenerator = async (req, res) => {
  const {
    generator_size_wattage,
    generator_cost_naira,
    fuel_consumption_per_hr,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO generators (generator_size_wattage, generator_cost_naira, fuel_consumption_per_hr) VALUES ($1, $2, $3) RETURNING *",
      [generator_size_wattage, generator_cost_naira, fuel_consumption_per_hr]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error adding generator" });
  }
};

const updateGenerator = async (req, res) => {
  const { id } = req.params;
  const {
    generator_size_wattage,
    generator_cost_naira,
    fuel_consumption_per_hr,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE generators SET generator_size_wattage = $1, generator_cost_naira = $2, fuel_consumption_per_hr = $3 WHERE id = $4 RETURNING *",
      [
        generator_size_wattage,
        generator_cost_naira,
        fuel_consumption_per_hr,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating generator" });
  }
};

const deleteGenerator = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM generators WHERE id = $1 RETURNING *",
      [id]
    );
    res.json({
      message: `Generator deleted successfully`,
      deletedRecord: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting generator" });
  }
};

// Inverters CRUD Functions
const getAllInverters = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inverters");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inverters" });
  }
};

const addInverter = async (req, res) => {
  const { inverter_size_watts, inverter_cost_naira } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO inverters (inverter_size_watts, inverter_cost_naira) VALUES ($1, $2) RETURNING *",
      [inverter_size_watts, inverter_cost_naira]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error adding inverter" });
  }
};

const updateInverter = async (req, res) => {
  const { id } = req.params;
  const { inverter_size_watts, inverter_cost_naira } = req.body;
  try {
    const result = await pool.query(
      "UPDATE inverters SET inverter_size_watts = $1, inverter_cost_naira = $2 WHERE id = $3 RETURNING *",
      [inverter_size_watts, inverter_cost_naira, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating inverter" });
  }
};

const deleteInverter = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM inverters WHERE id = $1 RETURNING *",
      [id]
    );
    res.json({
      message: `Inverter deleted successfully`,
      deletedRecord: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inverter" });
  }
};

// Solar Charge Controllers CRUD Functions
const getAllSolarChargeControllers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM solar_charge_controllers");
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching solar charge controllers" });
  }
};

const addSolarChargeController = async (req, res) => {
  const { solar_charge_controller_size, solar_charge_controller_cost_naira } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO solar_charge_controllers (solar_charge_controller_size, solar_charge_controller_cost_naira) VALUES ($1, $2) RETURNING *",
      [solar_charge_controller_size, solar_charge_controller_cost_naira]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error adding solar charge controller" });
  }
};

const updateSolarChargeController = async (req, res) => {
  const { id } = req.params;
  const { solar_charge_controller_size, solar_charge_controller_cost_naira } =
    req.body;
  try {
    const result = await pool.query(
      "UPDATE solar_charge_controllers SET solar_charge_controller_size = $1, solar_charge_controller_cost_naira = $2 WHERE id = $3 RETURNING *",
      [solar_charge_controller_size, solar_charge_controller_cost_naira, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating solar charge controller" });
  }
};

const deleteSolarChargeController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM solar_charge_controllers WHERE id = $1 RETURNING *",
      [id]
    );
    res.json({
      message: `Solar charge controller deleted successfully`,
      deletedRecord: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting solar charge controller" });
  }
};

module.exports = {
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
};

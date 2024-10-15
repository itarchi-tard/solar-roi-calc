// controllers/adminController.js

const db = require("../config/db"); // Assuming you have a PostgreSQL connection setup

// Get all generators
const getAllGenerators = async (req, res) => {
  try {
    const generators = await db.query("SELECT * FROM generators");
    res.json(generators.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching generators" });
  }
};

// Create a new generator
const createGenerator = async (req, res) => {
  const { size, cost, fuel_consumption } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO generators (size, cost, fuel_consumption) VALUES ($1, $2, $3) RETURNING *",
      [size, cost, fuel_consumption]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating generator" });
  }
};

// Update a generator
const updateGenerator = async (req, res) => {
  const { id } = req.params;
  const { size, cost, fuel_consumption } = req.body;
  try {
    const result = await db.query(
      "UPDATE generators SET size = $1, cost = $2, fuel_consumption = $3 WHERE id = $4 RETURNING *",
      [size, cost, fuel_consumption, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating generator" });
  }
};

// Delete a generator
const deleteGenerator = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM generators WHERE id = $1", [id]);
    res.status(204).json({ message: "Generator deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting generator" });
  }
};

module.exports = {
  getAllGenerators,
  createGenerator,
  updateGenerator,
  deleteGenerator,
};

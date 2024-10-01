// config/db.js

const { Pool } = require("pg");
require("dotenv").config();

// Determine if the app is running in production
const isProduction = process.env.NODE_ENV === "production";

// Configure SSL based on the environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Database connection error", err.stack);
  }
  console.log("Database connected successfully");
  release();
});

// Export the pool instance for use in other parts of the application
module.exports = pool;

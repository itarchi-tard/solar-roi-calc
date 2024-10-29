const express = require("express");
const path = require("path");
const roiRoutes = require("./routes/roiRoutes");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the frontend/public directory
app.use(express.static(path.join(__dirname, "../frontend/public")));

// API routes
app.use("/api/v1", roiRoutes);
app.use("/api/v1", adminRoutes);

// Catch-all route to handle unknown routes (but avoid overriding known files like admin.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

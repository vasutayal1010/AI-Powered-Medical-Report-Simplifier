import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
//const reportRoutes = require("./routes/reportRoutes");

import reportRoutes from './routes/reportRoutes.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// API Routes
app.use("/api/reports", reportRoutes);

// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running in on port ${PORT}`);
});

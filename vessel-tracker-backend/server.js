const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const vesselRoutes = require('./routes/vesselRoutes'); // Import vessel routes

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Use vessel routes
app.use('/api/vessels', vesselRoutes);

// Set the port for the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
{
  console.log(`Server running on port ${PORT}`);
});

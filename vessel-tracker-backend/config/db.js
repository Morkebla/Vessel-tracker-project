const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => 
  {
    
  try 
  {
    // Connect to MongoDB using MONGO_URI from the .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } 
  
  catch (err) 
  {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

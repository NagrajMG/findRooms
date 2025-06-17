// Load environment variables from .env file if not in production
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// Import required modules
const mongoose = require("mongoose");
const initData = require("./data.js");              // Sample listings data
const Listing = require("../models/listing.js");    // Listing model

// Get the MongoDB connection URL from env variables
const dbUrl = process.env.MONGODB_KEY;

// Connect to MongoDB
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err); // Handle connection errors
  });

async function main() {
    await mongoose.connect(dbUrl); // Establish DB connection
}

// Function to initialize database with sample listings
const initDB = async () => {
    await Listing.deleteMany({}); // Clear existing listings

    // Set a fixed owner ID to all listings (fake user ID for testing)
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "68517a6d95bc7cee734b69b5"
    }));

    // Insert sample listings into database
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

// Run the DB initialization
initDB();

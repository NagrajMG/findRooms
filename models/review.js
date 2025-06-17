const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for a review
const reviewSchema = new Schema({
    comment: String, // Text of the review

    rating: {
        type: Number,   // Numerical rating
        min: 1,         // Minimum rating value
        max: 5          // Maximum rating value
    },

    createdAt: {
        type: Date,
        default: Date.now() // Auto-assign current date/time
    },

    author: {
        type: Schema.Types.ObjectId, // Reference to User who wrote the review
        ref: "user"
    }
});

// Export the Review model
module.exports = mongoose.model("Review", reviewSchema);

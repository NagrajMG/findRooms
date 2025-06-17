const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// Define the schema for a listing 
const listingSchema = new Schema({
    title: {
        type: String,
        required: true, 
    },

    description: String, 

    image: {
        url: String,     // Cloudinary image URL
        filename: String // Image filename stored in Cloudinary
    },

    price: Number,       // Price per night

    location: String,    
    country: String,     

    review: [
        {
            type: Schema.Types.ObjectId, // Connect to Review model
            ref: "Review"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId, // Connect to User model
        ref: "user"
    }
});

// Middleware: delete all reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});

// Create and export the Listing model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

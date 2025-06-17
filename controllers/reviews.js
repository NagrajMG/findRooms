const Review = require("../models/review");
const Listing = require("../models/listing"); 

// Controller to handle creation of a new review
module.exports.createReview = async (req, res) => {
    // Find the listing the review is associated with
    let listing = await Listing.findById(req.params.id);

    // Create a new review from the form data
    let newReview = new Review(req.body.review);

    // Attach current user's ID as the author of the review
    newReview.author = req.user._id;

    // Add the review to the listing's review array
    listing.review.push(newReview);

    // Save both review and updated listing
    await newReview.save();
    await listing.save();

    // Show success message and redirect back to listing page
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

// Controller to handle deletion of a review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove the review reference from the listing using $pull
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the actual review document from the database
    await Review.findByIdAndDelete(reviewId);

    // Flash message and redirect to the listing page
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};

const express = require("express");
const router = express.Router({ mergeParams: true }); // Enables access to :id from parent route 

// Import utilities and middleware
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// Review controller
const reviewController = require("../controllers/reviews.js");

// Route to create a new review
router.post(
    "/",
    isLoggedIn,              // Ensure user is logged in
    validateReview,          // Validate review input using Joi
    wrapAsync(reviewController.createReview) // Handle review creation with custom error handling
);

// Route to delete a review
router.delete(
    "/:reviewId",
    isLoggedIn,              // Ensure user is logged in
    isReviewAuthor,          // Ensure user is the review's author
    wrapAsync(reviewController.destroyReview) // Handle deletion with custom error handling
);

module.exports = router;

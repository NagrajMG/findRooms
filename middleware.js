const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Middleware to check if user is authenticated (logged in)
module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {  
        // Save original URL to redirect after login
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

// Middleware to store redirect URL in res.locals (used after login)
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Middleware to check if the current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // Deny access if listing owner doesn't match current user
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Only the listing owner has permission to make changes!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Middleware to validate listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        // Throw custom error if validation fails
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Middleware to validate review data using Joi schema
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        // Throw custom error if validation fails
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Middleware to check if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    // Deny deletion if review author doesn't match current user
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Only the review author has permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

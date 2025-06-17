const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const lisitngController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // Set up file upload to Cloudinary

// Show all listings / Add a new listing
router
  .route("/")
  .get(wrapAsync(lisitngController.index)) // Show list of all listings
  .post(
    isLoggedIn,                            // Only logged-in users can add listings
    upload.single("listing[image]"),       // Handle single image upload 
    validateListing,                       // Check if data is valid
    wrapAsync(lisitngController.createListing) // Save listing to database
  );

// Show the form to create a new listing
router.get("/new", 
  isLoggedIn, 
  lisitngController.renderNewForm
);

// Show, update, or delete a single listing
router
  .route("/:id")
  .get(wrapAsync(lisitngController.showListing)) // Show details of one listing
  .put(
    isLoggedIn,                            // Must be logged in
    isOwner,                               // Only the owner can edit
    upload.single("listing[image]"),       // Handle new image upload if any
    validateListing,                       // Validate updated data
    wrapAsync(lisitngController.updateListing) // Save changes to DB
  )
  .delete(
    isLoggedIn,                            // Must be logged in
    isOwner,                               // Only the owner can delete
    wrapAsync(lisitngController.destroyListing) // Delete from DB
  );

// Show the form to edit an existing listing
router.get("/:id/edit", 
  isLoggedIn, 
  isOwner, 
  wrapAsync(lisitngController.renderEditForm)
);

module.exports = router;

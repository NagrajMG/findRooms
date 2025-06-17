const Listing = require("../models/listing"); 

module.exports.index = async (req, res) => { 
    const allListings = await Listing.find({})
    res.render ("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params; // Fetch the listing by ID and populate associated review and owner data
    const listing = await Listing.findById(id)
        .populate({ 
            path: "review",  // Populate the 'review' field: replaces review IDs with full Review documents
            populate: { path: "author"}}) // For each Review, also populate the 'author' field with User details (nested populate)
        .populate("owner");  // Populate the 'owner' field to get full User object of listing creator
    if(!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }
    console.log(listing);
    // Render the 'show' page with the fully populated listing data
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    // Extract image details from uploaded file (via multer & cloudinary)
    let url = req.file.path;
    let filename = req.file.filename;
    // Create a new Listing using form data from req.body
    const newListing = new Listing(req.body.listing);
    // Set the currently logged-in user as the owner of this listing
    newListing.owner = req.user._id;
    // Attach the uploaded image data to the listing
    newListing.image = { url, filename };
    // Save the listing to the database
    await newListing.save();
    // Redirect to the listings index page after successful creation
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res ) => {
    let {id} = req.params;  // Extract listing ID from the URL

    // Fetch the listing from the database using its ID
    const listing = await Listing.findById(id);
    // If listing not found, show an error message and redirect to the main listings page
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");  // Use return to avoid continuing execution
    }
    // Extract the image URL and modify it to get a smaller thumbnail-sized image for preview
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250");
    // This adds Cloudinary's width transformation (w_250 = 250px wide image)
    // Render the edit form, passing both the listing data and transformed image URL
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;  // Get listing ID from URL
    // Update listing data from the submitted form
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    // If a new image was uploaded, update the image fields
    if (typeof req.file !== "undefined") {
        let url = req.file.path;       // Cloudinary image URL
        let filename = req.file.filename; // Cloudinary image filename
        listing.image = { url, filename }; // Set new image data
        await listing.save(); // Save updated image info
    }
    // Show success message and redirect to the updated listing page
    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;  // Get the listing ID from the URL

    // Find the listing by ID and delete it from the database
    let deletedListing = await Listing.findByIdAndDelete(id);

    console.log(deletedListing); 

    // Show success message and redirect back to all listings
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};

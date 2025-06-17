const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary using credentials from environment variables (.env)
// This connects your backend to your Cloudinary account securely
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Set up multer storage engine to upload files directly to Cloudinary
// Uploaded images will be stored in the 'wanderlust_DEV' folder
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust_DEV",               // Destination folder in Cloudinary
        allowedFormats: ["png", "jpg", "jpeg"], // Restrict allowed image formats
    },
});

// Export the configured cloudinary instance and storage engine
// These will be used in route files to handle image uploads
module.exports = {
    cloudinary,
    storage,
};

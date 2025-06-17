const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Define user schema with email field
const userSchema = new Schema({
    email: {
        type: String,
        require: true, // Email is required
    }
});

// Adds username, hash, salt fields + authentication methods
userSchema.plugin(passportLocalMongoose);

// Export user model
module.exports = mongoose.model("user", userSchema);
